import { activeChats, EVENT_TYPES, MESSAGE_ROLES, model, getSystemPrompt } from "../constants/constants.js"
import Business from "../models/business.model.js";

export async function sendGreeting(socket, sessionId, businessId) {
  let session = activeChats.get(sessionId)
  if (!session) {
    session = {
      email: null,
      chatHistory: [],
      waitingForRepresentative: false,
      isWithRepresentative: false,
      businessId: businessId, // Preserve businessId
    }
    activeChats.set(sessionId, session)
  }
  const business = await Business.findById(businessId).populate("chatBot");
  // console.log(business?.chatBot?.welcomeMessage);

  const systemPrompt = await getSystemPrompt(businessId)
  const greetingPrompt = `
${systemPrompt}

Instructions:

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
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.ASSISTANT,
        isWithRepresentative: session.isWithRepresentative,
      },
    })
  } catch (error) {
    console.error("Greeting Error:", error)
    socket.emit(EVENT_TYPES.ERROR, "Failed to send welcome message")
  }
}