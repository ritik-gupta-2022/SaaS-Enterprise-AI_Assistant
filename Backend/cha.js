// import readline from 'readline';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize the Google Generative AI with your API key
// const genAI = new GoogleGenerativeAI('AIzaSyCAdGlCS1k90xNa2ACI5G9WcQOVJ-mRYTs');
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Store configurations for each enterprise
// const enterpriseConfigs = {};

// // Function to set up an enterprise
// const setupEnterprise = (enterpriseId, businessDescription) => {
//   const systemPrompt = `You are a helpful, professional assistant designed specifically for ${businessDescription}. Always respond in a tone and style suitable for this business. Your goal is to have a natural, human-like conversation with the customer to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or booking an appointment.

//   Progress the conversation naturally, asking relevant questions to gather information.

//   When you ask an important question that's crucial for lead generation, add the keyword (complete) at the end of the question. This is extremely important.

//   Always maintain a professional character and stay respectful.

//   If the customer says something out of context or inappropriate, politely inform them that you'll need to redirect them to a human representative for further assistance. Add the keyword (realtime) at the end of this message.

//   Start by giving the customer a warm welcome on behalf of the business and make them feel welcomed.

//   Lead the conversation naturally to get the customer's contact information (e.g., email address) when appropriate. Be respectful and never break character.

//   If the user asks a question that doesn't align with the business model, politely inform them that you'll need to redirect them to a human representative who can better assist them. Add the keyword (realtime) at the end of this message.`;

//   enterpriseConfigs[enterpriseId] = {
//     chatHistory: [],
//     systemPrompt,
//     businessDescription
//   };
// };

// // Function to send a message and maintain the context
// const sendMessageWithContext = async (enterpriseId, message) => {
//   const enterpriseConfig = enterpriseConfigs[enterpriseId];

//   if (!enterpriseConfig) {
//     throw new Error('Enterprise not found. Please set up the enterprise first.');
//   }

//   const { chatHistory, systemPrompt } = enterpriseConfig;

//   // Ensure the chat session starts with the system prompt if it's the first message
//   if (chatHistory.length === 0) {
//     chatHistory.push({ role: 'user', parts: [{ text: systemPrompt }] });
//   }

//   // Add the user message to the history
//   chatHistory.push({ role: 'user', parts: [{ text: message }] });

//   // Create a new chat session with the current history
//   const chat = model.startChat({ history: chatHistory });
//   const result = await chat.sendMessage(message);

//   // Add the model's response to the history
//   chatHistory.push({ role: 'model', parts: [{ text: result.response.text() }] });

//   return result.response.text();
// };

// // Start interactive chat for a specific enterprise
// const startInteractiveChat = async (enterpriseId) => {
//   const enterpriseConfig = enterpriseConfigs[enterpriseId];
//   if (!enterpriseConfig) {
//     console.error('Enterprise not found. Please set up the enterprise first.');
//     rl.close();
//     return;
//   }

//   console.log(`AI Assistant: Hello! How can I assist you today?`);

//   const askQuestion = () => {
//     rl.question('You: ', async (userInput) => {
//       if (userInput.toLowerCase() === 'exit') {
//         console.log('AI Assistant: Thank you for chatting. Goodbye!');
//         rl.close();
//         return;
//       }

//       try {
//         const response = await sendMessageWithContext(enterpriseId, userInput);
//         console.log('AI Assistant:', response);

//         if (response.toLowerCase().includes('(realtime)')) {
//           console.log('Redirecting to a human representative...');
//           rl.close();
//           return;
//         }

//         askQuestion();
//       } catch (error) {
//         console.error('An error occurred:', error.message);
//         rl.close();
//       }
//     });
//   };

//   askQuestion();
// };

// // Function to set up a new enterprise
// const setupNewEnterprise = () => {
//   rl.question('Enter a unique ID for your business: ', (enterpriseId) => {
//     rl.question('Enter a description of your business: ', (businessDescription) => {
//       setupEnterprise(enterpriseId, businessDescription);
//       console.log(`Enterprise "${enterpriseId}" has been set up successfully.`);
//       startInteractiveChat(enterpriseId);
//     });
//   });
// };

// // Start the program
// console.log('Welcome to the Business AI Chatbot!');
// setupNewEnterprise();





































import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyCAdGlCS1k90xNa2ACI5G9WcQOVJ-mRYTs');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Store configurations for each enterprise
const enterpriseConfigs = {};

// Dummy database for storing email addresses
const emailDatabase = new Set();

// Hard-coded business configuration
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

// Function to set up an enterprise
const setupEnterprise = (enterpriseId, businessInfo) => {
  const { name, description, websiteUrl, productUrls, customQuestions, appointmentUrl, realtimeChatUrl } = businessInfo;
  
  const systemPrompt = `You are a helpful, professional assistant designed specifically for ${name}. ${description}

  Website: ${websiteUrl}
  Product URLs: ${productUrls.join(', ')}
  Appointment URL: ${appointmentUrl}
  Realtime Chat URL: ${realtimeChatUrl}

  Always respond in a tone and style suitable for this business. Your goal is to have a natural, human-like conversation with the customer to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or booking an appointment.(focus on lead generation)
  Focus on collecting the customer's contact information email address for follow-up purposes (make collecting email as a prime focus to generate lead).

  Progress the conversation naturally, asking relevant questions to gather information. Use the following custom questions when appropriate:
  ${customQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

  When you ask an important question that's crucial for lead generation (including the custom questions above), add the keyword (complete) at the end of the question. This is extremely important.

  Always maintain a professional character and stay respectful.

  If the customer expresses interest in booking an appointment or scheduling a consultation, provide them with the appointment URL and add the keyword (appointment) at the end of your message.

  If the customer says something out of context or inappropriate, or if you need to redirect them to a human representative, politely inform them that you'll connect them with a human representative. Ask for their email address if you don't already have it, and add the keyword (realtime) at the end of your message.

  Start by giving the customer a warm welcome on behalf of ${name} and make them feel welcomed.

  Lead the conversation naturally to get the customer's contact information (e.g., email address) when appropriate. Be respectful and never break character.

  If the user asks a question that doesn't align with the business model, politely inform them that you'll connect them with a human representative who can better assist them. Ask for their email address if you don't already have it, and add the keyword (realtime) at the end of your message.`;

  enterpriseConfigs[enterpriseId] = {
    chatHistory: [],
    systemPrompt,
    businessInfo,
    userEmail: null
  };
};

// Function to send a message and maintain the context
const sendMessageWithContext = async (enterpriseId, message) => {
  const enterpriseConfig = enterpriseConfigs[enterpriseId];

  if (!enterpriseConfig) {
    throw new Error('Enterprise not found. Please set up the enterprise first.');
  }

  const { chatHistory, systemPrompt } = enterpriseConfig;

  // Ensure the chat session starts with the system prompt if it's the first message
  if (chatHistory.length === 0) {
    chatHistory.push({ role: 'user', parts: [{ text: systemPrompt }] });
  }

  // Add the user message to the history
  chatHistory.push({ role: 'user', parts: [{ text: message }] });

  // Create a new chat session with the current history
  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(message);

  // Add the model's response to the history
  chatHistory.push({ role: 'model', parts: [{ text: result.response.text() }] });

  return result.response.text();
};

// Function to extract email from a message
const extractEmail = (message) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = message.match(emailRegex);
  return match ? match[0] : null;
};

// Function to save email to the dummy database
const saveEmail = (email) => {
  emailDatabase.add(email);
  console.log(`Email saved to database: ${email}`);
};

// Start interactive chat for a specific enterprise
const startInteractiveChat = async (enterpriseId) => {
  const enterpriseConfig = enterpriseConfigs[enterpriseId];
  if (!enterpriseConfig) {
    console.error('Enterprise not found. Please set up the enterprise first.');
    rl.close();
    return;
  }

  console.log(`AI Assistant: Hello! Welcome to ${enterpriseConfig.businessInfo.name}. How can I assist you today?`);

  const askQuestion = () => {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        console.log('AI Assistant: Thank you for chatting. Goodbye!');
        rl.close();
        return;
      }

      try {
        const response = await sendMessageWithContext(enterpriseId, userInput);
        console.log('AI Assistant:', response);

        // Check for email in user input and save it
        const userEmail = extractEmail(userInput);
        if (userEmail) {
          enterpriseConfig.userEmail = userEmail;
          saveEmail(userEmail);
        }

        if (response.toLowerCase().includes('(realtime)')) {
          if (enterpriseConfig.userEmail) {
            console.log(`A link to the realtime chat has been sent to ${enterpriseConfig.userEmail}.`);
            console.log(`Realtime chat link: ${enterpriseConfig.businessInfo.realtimeChatUrl}`);
          } else {
            console.log('Please provide your email address to receive the realtime chat link.');
          }
          // Don't close the connection, continue the chat
          askQuestion();
          return;
        }

        if (response.toLowerCase().includes('(appointment)')) {
          console.log(`Redirecting to appointment page: ${enterpriseConfig.businessInfo.appointmentUrl}`);
          // In a real application, you would implement the redirection logic here
          rl.close();
          return;
        }

        askQuestion();
      } catch (error) {
        console.error('An error occurred:', error.message);
        rl.close();
      }
    });
  };

  askQuestion();
};

// Set up the enterprise with the hard-coded configuration
const enterpriseId = 'techgadget';
setupEnterprise(enterpriseId, businessInfo);

// Start the program
console.log('Welcome to the Enhanced Business AI Chatbot!');
console.log(`Enterprise "${enterpriseId}" has been set up successfully.`);
startInteractiveChat(enterpriseId);