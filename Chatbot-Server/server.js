import express from "express"
import http from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import { GoogleGenerativeAI } from "@google/generative-ai"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"
import Session from "./models/session.model.js"
import chatbotRoutes from './routes/chatbot.route.js'
import handleChat from "./utils/handleChat.js"
import { activeChats, EVENT_TYPES, MESSAGE_ROLES, model } from "./constants/constants.js"
import { sendGreeting } from "./utils/sendGreeting.js"
import Business from "./models/business.model.js" // Added import

dotenv.config()

const app = express()
const server = http.createServer(app)

mongoose.connect(process.env.MONGO)
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log(err))

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

app.use("", chatbotRoutes);

const TAG_SYMBOL = "⚡"

io.on("connection", (socket) => {
  const sessionId = socket.id
  const businessId = socket.handshake.query.businessId || null; // Or however you prefer to retrieve it

  console.log("New connection:", sessionId)

  const roomId = `${sessionId}`

  let session = activeChats.get(sessionId)
  if (!session) {
    session = {
      email: null,
      chatHistory: [],
      roomId,
      waitingForRepresentative: false,
      isWithRepresentative: false,
      businessId: businessId, // Added
    }
    // console.log(session);
    activeChats.set(sessionId, session)
    handleChat(sessionId, "User has joined the chat." ,false, true, businessId).catch((error) => {
      console.error("Error adding user join message:", error)
    })
  } else {
    session.roomId = roomId
  }

  socket.join(roomId)

  sendGreeting(socket, sessionId, businessId) // Pass businessId

  socket.on("checkRoomStatus", (roomId, callback) => {
    const isActive = io.sockets.adapter.rooms.has(roomId)
    callback({ isActive })
  })

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId)
  })

  socket.on("message", async (messageText) => {
    try {
      const response = await handleChat(sessionId, messageText, false, false, businessId)

      const hasRealtimeTag = response.message.includes(`${TAG_SYMBOL}realtime${TAG_SYMBOL}`)
      const hasAppointmentTag = response.message.includes(`${TAG_SYMBOL}appointment${TAG_SYMBOL}`)
      const hasHandoverTag = response.message.includes(`${TAG_SYMBOL}handover${TAG_SYMBOL}`)

      const eventType = hasRealtimeTag
        ? EVENT_TYPES.REALTIME
        : hasAppointmentTag
          ? EVENT_TYPES.APPOINTMENT
          : hasHandoverTag
            ? EVENT_TYPES.HANDOVER
            : EVENT_TYPES.RESPONSE

      const tags = response.message.match(new RegExp(`${TAG_SYMBOL}[^${TAG_SYMBOL}]+${TAG_SYMBOL}`, "g")) || []

      const cleanMessage = response.message
        .replace(new RegExp(`${TAG_SYMBOL}[^${TAG_SYMBOL}]+${TAG_SYMBOL}`, "g"), "")
        .trim()

      const business = businessId ? await Business.findById(businessId) : null
      const appointmentUrl = business?.appointmentUrl || null

      io.to(roomId).emit(eventType, {
        message: cleanMessage,
        link: eventType === EVENT_TYPES.APPOINTMENT ? appointmentUrl : null,
        sessionInfo: {
          ...response.sessionInfo,
          tags,
        },
      })

      if (eventType === EVENT_TYPES.REALTIME) {
        axios.get("http://localhost:5000/notify").catch(console.error)
      }

      io.to("admin").emit("user-message", {
        roomId: roomId,
        message: messageText,
        sessionInfo: response.sessionInfo,
      })

      if (response.sessionInfo.waitingForRepresentative) {
        io.to("admin").emit("customerWaiting", {
          roomId: response.sessionInfo.roomId,
          email: response.sessionInfo.email,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      socket.emit(EVENT_TYPES.ERROR, "An error occurred while processing your request.")
    }
  })

  socket.on("adminMessage", async ({ roomId, message }) => {
    try {
      const response = await handleChat(roomId, message, true, true, businessId)
      io.to(roomId).emit("admin-response", {
        message: response.message,
        sessionInfo: {
          ...response.sessionInfo,
          isAdmin: true,
        },
      })
    } catch (error) {
      console.error("Admin Message Error:", error)
      socket.emit(EVENT_TYPES.ERROR, "An error occurred while sending the admin message.")
    }
  })

  socket.on(EVENT_TYPES.JOIN_AS_REPRESENTATIVE, (roomId) => {
    socket.join(roomId)
    socket.join("admin")
    handleChat(roomId, "A representative has joined the conversation. ⚡handover⚡",true, true, businessId)
      .then((response) => {
        io.to(roomId).emit(EVENT_TYPES.HANDOVER, {
          message: response.message,
          sessionInfo: response.sessionInfo,
        })
      })
      .catch((error) => {
        console.error("Error sending handover message:", error)
      })
    const session = Array.from(activeChats.values()).find((s) => s.roomId === roomId)
    if (session) {
      session.isWithRepresentative = true
      activeChats.set(roomId, session)
    }
  })

  socket.on(EVENT_TYPES.LEAVE_AS_REPRESENTATIVE, (roomId) => {
    socket.leave(roomId)
    const session = Array.from(activeChats.values()).find((s) => s.roomId === roomId)
    if (session) {
      session.isWithRepresentative = false
      activeChats.set(roomId, session)
      handleChat(roomId, "The representative has left the conversation. ⚡ai-resume⚡",false, true, businessId)
        .then((response) => {
          io.to(roomId).emit(EVENT_TYPES.AI_RESUME, {
            message: response.message,
            sessionInfo: response.sessionInfo,
          })
        })
        .catch((error) => {
          console.error("Error resuming AI conversation:", error)
        })
    }
  })

  socket.on(EVENT_TYPES.REPRESENTATIVE_MESSAGE, async ({ roomId, message }) => {
    if (typeof roomId === "string" && typeof message === "string") {
      await handleRepresentativeMessage(roomId, message)
    }
  })

  socket.on("disconnect", () => {
    const session = activeChats.get(sessionId)
    if (session?.email) {
      Session.findOneAndUpdate({ email: session.email,businessId:session.businessId }, { chatHistory: session.chatHistory,businessId:session.businessId }, { upsert: true }).catch(
        
        console.error,
      )
      io.to("admin").emit("user-disconnected", {
        roomId: session.roomId,
        email: session.email,
        timestamp: new Date(),
      })
    }
    activeChats.delete(sessionId)
  })
})

async function handleRepresentativeMessage(roomId, message) {
  const session = activeChats.get(roomId)
  if (session && session.isWithRepresentative) {
    session.chatHistory.push({
      role: MESSAGE_ROLES.REPRESENTATIVE,
      content: message,
      timestamp: new Date(),
    })

    io.to(roomId).emit(EVENT_TYPES.REPRESENTATIVE_MESSAGE, {
      message,
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.REPRESENTATIVE,
      },
    })

    await Session.findOneAndUpdate(
      { email: session.email,businessId:session.businessId },
      {
        email: session.email,
        roomId: session.roomId,
        chatHistory: session.chatHistory,
        businessId: session.businessId
      },
      { upsert: true },
    )
  }
}

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
