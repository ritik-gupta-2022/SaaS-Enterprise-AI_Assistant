import { activeChats, EVENT_TYPES, MESSAGE_ROLES, model, systemPrompt } from "../constants/constants.js"

export async function sendGreeting(socket, sessionId) {
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