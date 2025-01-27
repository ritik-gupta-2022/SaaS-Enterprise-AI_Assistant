import express from "express"
import http from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import { GoogleGenerativeAI } from "@google/generative-ai"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())
app.get("/customers", async (req, res) => {
  const session = await Session.find()
  if (session) {
    res.status(200).send(session)
  } else {
    res.status(500).send("Failed to fetch customer sessions")
  }
})
app.get("/notify", async (req, res) => {
  console.log("notified");
  res.status(200).send("Notification received");
})
mongoose.connect(process.env.MONGO)
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log(err))

const sessionSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  roomId: String,
  chatHistory: [
    {
      role: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
})

const Session = mongoose.model("Session", sessionSchema)

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const businessInfo = {
  name: "TechGadget Store",
  description:
    "We are a premium electronics retailer specializing in cutting-edge smartphones, laptops, and smart home devices.",
  websiteUrl: "https://www.techgadgetstore.com",
  productUrls: [
    "https://www.techgadgetstore.com/smartphones",
    "https://www.techgadgetstore.com/laptops",
    "https://www.techgadgetstore.com/smart-home",
  ],
  customQuestions: [
    "What type of device are you looking for today?",
    "Do you prefer any specific brands?",
    "What's your budget range for this purchase?",
    "Are there any must-have features you're looking for?",
  ],
  appointmentUrl: "/appointmentAttachment",
}

const systemPrompt = `You are a helpful, professional assistant designed specifically for ${businessInfo.name}. ${businessInfo.description}

Website: ${businessInfo.websiteUrl}
Product URLs: ${businessInfo.productUrls.join(", ")}
Appointment URL: ${businessInfo.appointmentUrl}

Always respond in a tone and style suitable for this business. Your goal is to have a natural, human-like conversation with the customer to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or booking an appointment.

Progress the conversation naturally, asking relevant questions to gather information. Use the following custom questions when appropriate:
${businessInfo.customQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

When you ask an important question that's crucial for lead generation (including the custom questions above), add the keyword ⚡complete⚡ at the end of the question. This is extremely important.

Always maintain a professional character and stay respectful.

If the customer expresses interest in booking an appointment or scheduling a consultation, provide them with the appointment URL and add the keyword ⚡appointment⚡ at the end of your message.

REAL-TIME CHAT SCENARIO:
1. If the user asks for real-time support or if you need to redirect them to a human representative:
   a. If the user's email is not provided, politely ask for it first.
   b. Once you have the email, inform the user that you're connecting them to a representative.
   c. Add the keyword ⚡realtime⚡ at the end of your message.
   d. In your next message, inform the user that you're waiting for a representative to join and ask them to please stand by.
2. When a representative joins:
   a. Greet the representative and provide a brief summary of the conversation.
   b. Add the keyword ⚡handover⚡ at the end of your message.
   c. Stop responding and let the human representative take over.
3. When the representative disconnects:
   a. Resume the conversation with the user.
   b. Ask if they need any further assistance.
   c. Add the keyword ⚡ai-resume⚡ at the end of your message.

USER JOIN EVENT:
When you see a system message indicating "User has joined the chat.", this means a new user has connected. Greet them warmly and start the conversation as usual.

Start by giving the customer a warm welcome on behalf of ${businessInfo.name} and make them feel welcomed.

Lead the conversation naturally to get the customer's contact information (e.g., email address) when appropriate. Be respectful and never break character.

IMPORTANT: For any response where the user hasn't provided an email yet, end your message by politely asking for their email address to better assist them. Add the ⚡email⚡ tag at the end of such requests.

Tag Format Rules:
All tags must be wrapped with ⚡ symbols. For example:
- For complete: ⚡complete⚡
- For appointments: ⚡appointment⚡
- For realtime chat: ⚡realtime⚡
- For email requests: ⚡email⚡
- For verified users: ⚡user: email@example.com⚡
- For AI handover: ⚡handover⚡
- For AI resuming: ⚡ai-resume⚡
- For verified users: ⚡user: email@example.com⚡

Example responses:
"Let me help you with that. What's your budget range? ⚡complete⚡"
"I'll connect you to live support. ⚡realtime⚡ ⚡user: john@email.com⚡"
"A representative will join shortly. While we're waiting, could you please summarize your main concerns? ⚡realtime⚡"
"Welcome, representative. The customer has been inquiring about our latest smartphone models. Over to you. ⚡handover⚡"
"The representative has disconnected. Is there anything else I can help you with? ⚡ai-resume⚡"
`

const activeChats = new Map()

const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
  REPRESENTATIVE: "representative",
}

const EVENT_TYPES = {
  RESPONSE: "ai-response",
  REALTIME: "realtime",
  APPOINTMENT: "appointment",
  ERROR: "error",
  HANDOVER: "handover",
  AI_RESUME: "ai-resume",
  REPRESENTATIVE_MESSAGE: "representative-message",
  JOIN_AS_REPRESENTATIVE: "joinAsRepresentative",
  LEAVE_AS_REPRESENTATIVE: "leaveAsRepresentative",
}

async function handleChat(sessionId, message, isRepresentative = false, isSystemMessage = false) {
  let session = activeChats.get(sessionId)
  if (!session) {
    session = { email: null, chatHistory: [], waitingForRepresentative: false, isWithRepresentative: false }
    activeChats.set(sessionId, session)
  }

  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)

  if (emailMatch && !session.email) {
    const email = emailMatch[0]
    const existingSession = await Session.findOne({ email })

    if (existingSession) {
      session.email = email
      session.chatHistory = existingSession.chatHistory
    } else {
      session.email = email
    }
    session.roomId = `${sessionId}`
    activeChats.set(sessionId, session)
  }

  session.chatHistory.push({
    role: isSystemMessage ? MESSAGE_ROLES.SYSTEM : isRepresentative ? MESSAGE_ROLES.REPRESENTATIVE : MESSAGE_ROLES.USER,
    content: message,
    timestamp: new Date(),
  })

  if (session.email && (isRepresentative || !isSystemMessage)) {
    await Session.findOneAndUpdate(
      { email: session.email },
      {
        email: session.email,
        roomId: session.roomId,
        chatHistory: session.chatHistory,
      },
      { upsert: true },
    )
  }

  if (isSystemMessage) {
    return {
      message: message,
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.SYSTEM,
        isWithRepresentative: session.isWithRepresentative,
      },
    }
  }

  if (isRepresentative && !session.isWithRepresentative) {
    session.isWithRepresentative = true
    session.waitingForRepresentative = false
    const handoverMessage = `A representative has joined the conversation. Here's a summary of the chat so far: ${session.chatHistory
      .slice(-5)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join(" | ")} ⚡handover⚡`
    session.chatHistory.push({
      role: MESSAGE_ROLES.ASSISTANT,
      content: handoverMessage,
      timestamp: new Date(),
    })
    return {
      message: handoverMessage,
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.ASSISTANT,
        isWithRepresentative: true,
      },
    }
  }

  if (isRepresentative) {
    return {
      message: message,
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.REPRESENTATIVE,
        isWithRepresentative: true,
      },
    }
  }

  if (session.isWithRepresentative) {
    return {
      message: "You are now chatting with a representative.",
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.SYSTEM,
        isWithRepresentative: true,
      },
    }
  }

  const contextPrompt = `
${systemPrompt}

Current Session Status:
- Email: ${session.email ? session.email : "Not provided"}
- Waiting for representative: ${session.waitingForRepresentative ? "Yes" : "No"}
- With representative: ${session.isWithRepresentative ? "Yes" : "No"}

Chat History:
${session.chatHistory
  .slice(-10)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}

Current Message: ${message}

Instructions:
1. Current email status: ${session.email ? `Verified (${session.email})` : "Not provided"}
2. If user needs realtime chat:
   - With email: Inform waiting for representative
   - Without email: Ask for email first
3. Keep conversation natural and professional
`

  try {
    const chat = model.startChat()
    const result = await chat.sendMessage(contextPrompt)
    const aiResponse = result.response.text()

    if (aiResponse.includes("⚡realtime⚡")) {
      session.waitingForRepresentative = true
    }

    session.chatHistory.push({
      role: MESSAGE_ROLES.ASSISTANT,
      content: aiResponse,
      timestamp: new Date(),
    })

    if (session.email) {
      await Session.findOneAndUpdate(
        { email: session.email },
        {
          email: session.email,
          roomId: session.roomId,
          chatHistory: session.chatHistory,
        },
        { upsert: true },
      )
    }

    activeChats.set(sessionId, session)

    return {
      message: aiResponse,
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.ASSISTANT,
        waitingForRepresentative: session.waitingForRepresentative,
        isWithRepresentative: session.isWithRepresentative,
      },
    }
  } catch (error) {
    console.error("AI Response Error:", error)
    throw error
  }
}

async function sendGreeting(socket, sessionId) {
  const session = { email: null, chatHistory: [] }
  activeChats.set(sessionId, session)

  const greetingPrompt = `
${systemPrompt}

Instructions:
- Send a warm welcome message
- Introduce the store and services briefly
- Ask how you can help them today
- Remember to ask for email naturally
- Keep it friendly and professional
`

  try {
    const chat = model.startChat()
    const result = await chat.sendMessage(greetingPrompt)
    const greeting = result.response.text()

    session.chatHistory.push({
      role: MESSAGE_ROLES.ASSISTANT,
      content: greeting,
      timestamp: new Date(),
    })

    socket.emit(EVENT_TYPES.RESPONSE, {
      message: greeting,
      sessionInfo: {
        hasEmail: false,
        email: null,
        messageCount: 1,
        type: MESSAGE_ROLES.ASSISTANT,
      },
    })
  } catch (error) {
    console.error("Greeting Error:", error)
    socket.emit(EVENT_TYPES.ERROR, "Failed to send welcome message")
  }
}

const TAG_SYMBOL = "⚡"

io.on("connection", (socket) => {
  const sessionId = socket.id
  console.log("New connection:", sessionId)

  const roomId = `${sessionId}`

  let session = activeChats.get(sessionId)
  if (!session) {
    session = { email: null, chatHistory: [], roomId, waitingForRepresentative: false, isWithRepresentative: false }
    activeChats.set(sessionId, session)
    handleChat(sessionId, "User has joined the chat.", false, true).catch((error) => {
      console.error("Error adding user join message:", error)
    })
  } else {
    session.roomId = roomId
  }

  socket.join(roomId)

  sendGreeting(socket, sessionId)

  socket.on("checkRoomStatus", (roomId, callback) => {
    const isActive = io.sockets.adapter.rooms.has(roomId)
    callback({ isActive })
  })

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId)
  })

  socket.on("message", async (messageText) => {
    try {
      const response = await handleChat(sessionId, messageText)

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

      io.to(roomId).emit(eventType, {
        message: cleanMessage,
        link: eventType === EVENT_TYPES.APPOINTMENT ? businessInfo.appointmentUrl : null,
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
      const response = await handleChat(roomId, message, true, true)
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
    handleChat(roomId, "A representative has joined the conversation. ⚡handover⚡", true, true)
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
      handleChat(roomId, "The representative has left the conversation. ⚡ai-resume⚡", false, true)
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
      Session.findOneAndUpdate({ email: session.email }, { chatHistory: session.chatHistory }, { upsert: true }).catch(
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
      { email: session.email },
      {
        email: session.email,
        roomId: session.roomId,
        chatHistory: session.chatHistory,
      },
      { upsert: true },
    )
  }
}

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
