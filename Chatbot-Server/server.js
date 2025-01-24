const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// mongoose.connect(process.env.MONGO, {
//   useNewUrlParser: true, 
//   useUnifiedTopology: true,
//   ssl: true,
//   tlsInsecure: true // Only if you're having SSL certificate issues
// });

mongoose.connect(process.env.MONGO)
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log(err))

// Temporary storage for anonymous chats
const tempChats = new Map();

// Create a schema for user sessions
const sessionSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  chatHistory: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

const Session = mongoose.model('Session', sessionSchema);

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Business configuration
const businessInfo = {
  name: 'TechGadget Store',
  description: 'We are a premium electronics retailer specializing in cutting-edge smartphones, laptops, and smart home devices.',
  websiteUrl: 'https://www.techgadgetstore.com',
  productUrls: [
    'https://www.techgadgetstore.com/smartphones',
    'https://www.techgadgetstore.com/laptops',
    'https://www.techgadgetstore.com/smart-home'
  ],
  customQuestions: [
    'What type of device are you looking for today?',
    'Do you prefer any specific brands?',
    'What\'s your budget range for this purchase?',
    'Are there any must-have features you\'re looking for?'
  ],
  appointmentUrl: '/appointmentAttachment',
  realtimeChatUrl: 'https://www.techgadgetstore.com/realtime-chat'
};

const systemPrompt = `You are a helpful, professional assistant designed specifically for ${businessInfo.name}. ${businessInfo.description}

Website: ${businessInfo.websiteUrl}
Product URLs: ${businessInfo.productUrls.join(', ')}
Appointment URL: ${businessInfo.appointmentUrl}
Realtime Chat URL: ${businessInfo.realtimeChatUrl}

Always respond in a tone and style suitable for this business. Your goal is to have a natural, human-like conversation with the customer to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or booking an appointment.

Progress the conversation naturally, asking relevant questions to gather information. Use the following custom questions when appropriate:
${businessInfo.customQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

When you ask an important question that's crucial for lead generation (including the custom questions above), add the keyword ⚡complete⚡ at the end of the question. This is extremely important.

Always maintain a professional character and stay respectful.

If the customer expresses interest in booking an appointment or scheduling a consultation, provide them with the appointment URL and add the keyword ⚡appointment⚡ at the end of your message.

If the customer says something out of context or inappropriate, or if you need to redirect them to a human representative, politely inform them that you'll connect them with a human representative. Ask for their email address if you don't already have it then only send link for realtime if not ask for email again politely,  and add the keyword ⚡realtime⚡ at the end of your message.

Start by giving the customer a warm welcome on behalf of ${businessInfo.name} and make them feel welcomed.

Lead the conversation naturally to get the customer's contact information (e.g., email address) when appropriate. Be respectful and never break character.

If the user asks a question that doesn't align with the business model, politely inform them that you'll connect them with a human representative who can better assist them. Ask for their email address if you don't already have it then only send link for realtime if not ask for email again politely,  and add the keyword ⚡realtime⚡ at the end of your message

IMPORTANT: For any response where the user hasn't provided an email yet, end your message by politely asking for their email address to better assist them. Add tag at the end of such requests.

IMPORTANT RULES FOR REALTIME CHAT:
1. Only provide realtime chat link if user has already given their email
2. If user needs realtime chat but hasn't provided email:
   - First ask for their email politely
   - DO NOT include the ⚡realtime⚡ tag until email is provided
   - Explain that email is required for live support
3. Once email is provided, you can then include the realtime chat link with ⚡realtime⚡ tag

For all responses:
- If user has email: Include their email at end with ⚡user: email@example.com⚡
- If no email: Ask for email naturally at the end of the message
- Only use when user go out of context or ask for realtime help⚡realtime⚡ tag when sharing link AND user has verified email

Tag Format Rules:
All tags must be wrapped with ⚡ symbols. For example:
- For complete: ⚡complete⚡
- For appointments: ⚡appointment⚡
- For realtime chat: ⚡realtime⚡
- For verified users: ⚡user: email@example.com⚡

Example responses:
"Let me help you with that. What's your budget range? ⚡complete⚡"
"I'll connect you to live support. ⚡realtime⚡ ⚡user: john@email.com⚡"
`;

// Session management object
const activeChats = new Map(); // { socketId: { email: string, chatHistory: array } }

const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

const EVENT_TYPES = {
  RESPONSE: 'ai-response',
  REALTIME: 'realtime',
  APPOINTMENT: 'appointment',
  ERROR: 'error'
};

// Function to send a message and maintain the context
async function handleChat(sessionId, message) {
  let session = activeChats.get(sessionId);
  if (!session) {
    session = { email: null, chatHistory: [] };
    activeChats.set(sessionId, session);
  }

  // Handle email detection from message text
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  
  if (emailMatch && !session.email) {
    const email = emailMatch[0];
    const existingSession = await Session.findOne({ email });
    
    if (existingSession) {
      session.email = email;
      session.chatHistory = existingSession.chatHistory;
    } else {
      session.email = email;
    }
    activeChats.set(sessionId, session);
  }

  // Add message to history first
  session.chatHistory.push({
    role: MESSAGE_ROLES.USER,
    content: message,
    timestamp: new Date()
  });

  // Prepare AI context
  const contextPrompt = `
${systemPrompt}

Current Session Status:
- Email: ${session.email ? session.email : 'Not provided'}
- Can share realtime link: ${session.email ? 'Yes' : 'No - need email first'}

Chat History:
${session.chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current Message: ${message}

Instructions:
1. Current email status: ${session.email ? `Verified (${session.email})` : 'Not provided'}
2. If user needs realtime chat:
   - With email: Provide link with ⚡realtime⚡ tag
   - Without email: Ask for email first, no link
3. Keep conversation natural and professional
4. Remember: NO realtime links without verified email
`;

  try {
    // Get AI response
    const chat = model.startChat();
    const result = await chat.sendMessage(contextPrompt);
    const aiResponse = result.response.text();

    // Add AI response to history
    session.chatHistory.push({
      role: MESSAGE_ROLES.ASSISTANT,
      content: aiResponse,
      timestamp: new Date()
    });

    // Save to DB if email exists
    if (session.email) {
      await Session.findOneAndUpdate(
        { email: session.email },
        { 
          email: session.email,
          chatHistory: session.chatHistory 
        },
        { upsert: true }
      );
    }

    // Update active session
    activeChats.set(sessionId, session);

    // Standardized response object
    const responseObject = {
      message: aiResponse,
      sessionInfo: {
        hasEmail: !!session.email,
        email: session.email,
        messageCount: session.chatHistory.length,
        type: MESSAGE_ROLES.ASSISTANT
      }
    };

    return responseObject;
  } catch (error) {
    console.error('AI Response Error:', error);
    throw error;
  }
}

async function sendGreeting(socket, sessionId) {
  const session = { email: null, chatHistory: [] };
  activeChats.set(sessionId, session);

  const greetingPrompt = `
${systemPrompt}

Instructions:
- Send a warm welcome message
- Introduce the store and services briefly
- Ask how you can help them today
- Remember to ask for email naturally
- Keep it friendly and professional
`;

  try {
    const chat = model.startChat();
    const result = await chat.sendMessage(greetingPrompt);
    const greeting = result.response.text();

    session.chatHistory.push({
      role: MESSAGE_ROLES.ASSISTANT,
      content: greeting,
      timestamp: new Date()
    });

    socket.emit(EVENT_TYPES.RESPONSE, {
      message: greeting,
      sessionInfo: {
        hasEmail: false,
        email: null,
        messageCount: 1,
        type: MESSAGE_ROLES.ASSISTANT
      }
    });
  } catch (error) {
    console.error('Greeting Error:', error);
    socket.emit(EVENT_TYPES.ERROR, 'Failed to send welcome message');
  }
}

const TAG_SYMBOL = '⚡';

io.on('connection', (socket) => {
  const sessionId = socket.id;
  console.log('New connection:', sessionId);
  
  // Send greeting immediately on connection
  sendGreeting(socket, sessionId);

  socket.on('message', async (messageText) => {
    try {
      const response = await handleChat(sessionId, messageText);
      
      // Updated tag detection with exact symbol matching
      const hasRealtimeTag = response.message.includes(`${TAG_SYMBOL}realtime${TAG_SYMBOL}`);
      const hasAppointmentTag = response.message.includes(`${TAG_SYMBOL}appointment${TAG_SYMBOL}`);
      
      const eventType = hasRealtimeTag ? EVENT_TYPES.REALTIME :
                       hasAppointmentTag ? EVENT_TYPES.APPOINTMENT :
                       EVENT_TYPES.RESPONSE;
      
      // Extract tags while preserving symbols
      const tags = response.message.match(new RegExp(`${TAG_SYMBOL}[^${TAG_SYMBOL}]+${TAG_SYMBOL}`, 'g')) || [];
      
      // Remove tags from message but keep other instances of the symbol
      const cleanMessage = response.message.replace(new RegExp(`${TAG_SYMBOL}[^${TAG_SYMBOL}]+${TAG_SYMBOL}`, 'g'), '').trim();
      
      socket.emit(eventType, {
        message: cleanMessage,
        link: eventType === EVENT_TYPES.REALTIME ? businessInfo.realtimeChatUrl : 
              eventType === EVENT_TYPES.APPOINTMENT ? businessInfo.appointmentUrl : null,
        sessionInfo: {
          ...response.sessionInfo,
          tags
        }
      });
    } catch (error) {
      console.error('Error:', error);
      socket.emit(EVENT_TYPES.ERROR, 'An error occurred while processing your request.');
    }
  });

  socket.on('disconnect', () => {
    const session = activeChats.get(sessionId);
    if (session?.email) {
      Session.findOneAndUpdate(
        { email: session.email },
        { chatHistory: session.chatHistory },
        { upsert: true }
      ).catch(console.error);
    }
    activeChats.delete(sessionId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});