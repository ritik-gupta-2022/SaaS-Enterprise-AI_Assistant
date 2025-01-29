import { activeChats, MESSAGE_ROLES, model, getSystemPrompt } from "../constants/constants.js"
import Session from "../models/session.model.js"

async function handleChat(sessionId, message, isRepresentative = false, isSystemMessage = false, businessId) {
  let session = activeChats.get(sessionId)
  if (!session) {
    session = { email: null, chatHistory: [], waitingForRepresentative: false, isWithRepresentative: false,businessId:businessId }
    activeChats.set(sessionId, session)
  }
  console.log(session);


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
        businessId: session.businessId, // Added
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

  const prompt = await getSystemPrompt(businessId)
  const contextPrompt = `
${prompt}

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
4. Important Do not send any response like "Realtime chat: null"
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
          businessId: session.businessId, // Added
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

export default handleChat;