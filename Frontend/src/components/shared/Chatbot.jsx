import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { cn } from "@/lib/utils"; // Import cn utility

const socket = io('http://localhost:5000');

const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  REPRESENTATIVE: 'representative', // Added representative type
  ADMIN: 'admin',
  ERROR: 'error'
};

const EVENT_TYPES = {
  RESPONSE: 'ai-response',
  REALTIME: 'realtime',
  APPOINTMENT: 'appointment',
  ERROR: 'error',
  REPRESENTATIVE_MESSAGE: 'representative-message', // New event type
  HANDOVER: 'handover',
  AI_RESUME: 'ai-resume'
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionInfo, setSessionInfo] = useState({ hasEmail: false, messageCount: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on(EVENT_TYPES.RESPONSE, (data) => {
      const { message, sessionInfo } = data;
      setSessionInfo(prevInfo => ({
        ...prevInfo,
        ...sessionInfo
      }));
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.ASSISTANT, 
        content: message, // Message comes with tags already removed
        isVerified: sessionInfo?.hasEmail,
        tags: sessionInfo?.tags || []
      }]);
    });

    socket.on(EVENT_TYPES.REALTIME, ({ message, link, sessionInfo }) => {
      setSessionInfo(sessionInfo);
      setMessages(prev => [...prev, 
        { 
          type: MESSAGE_TYPES.SYSTEM, 
          content: message,
          isVerified: sessionInfo.hasEmail,
          tags: sessionInfo?.tags || []
        }
      ]);
    });

    socket.on(EVENT_TYPES.APPOINTMENT, ({ message, link, sessionInfo }) => {
      setSessionInfo(sessionInfo);
      setMessages(prev => [...prev, 
        { 
          type: MESSAGE_TYPES.SYSTEM, 
          content: message,
          isVerified: sessionInfo.hasEmail,
          tags: sessionInfo?.tags || []
        },
        { 
          type: MESSAGE_TYPES.SYSTEM, 
          content: `Appointment: ${link}`,
          isVerified: sessionInfo.hasEmail,
          tags: sessionInfo?.tags || []
        }
      ]);
    });

    socket.on(EVENT_TYPES.ERROR, (error) => {
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.ERROR, 
        content: error 
      }]);
    });

    socket.on('handover', ({ message, sessionInfo }) => {
      setSessionInfo(prev => ({ ...prev, ...sessionInfo }));
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.SYSTEM, 
        content: message, 
        isVerified: sessionInfo?.hasEmail,
        tags: sessionInfo?.tags || []
      }]);
    });

    socket.on('ai-resume', ({ message, sessionInfo }) => {
      setSessionInfo(prev => ({ ...prev, ...sessionInfo }));
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.SYSTEM, 
        content: message, 
        isVerified: sessionInfo?.hasEmail,
        tags: sessionInfo?.tags || []
      }]);
    });

    // Listen for admin messages
    socket.on('admin-response', ({ message, sessionInfo }) => {
      setSessionInfo(prev => ({ ...prev, ...sessionInfo }));
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.ADMIN, 
        content: message, 
        isVerified: sessionInfo?.hasEmail,
        tags: sessionInfo?.tags || []
      }]);
    });

    // Listen for user messages from admin
    socket.on('user-message', ({ roomId, message, sessionInfo }) => {
      setSessionInfo(prev => ({ ...prev, ...sessionInfo }));
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.USER, 
        content: message, 
        isVerified: sessionInfo?.hasEmail,
        tags: sessionInfo?.tags || []
      }]);
    });

    // Listen for representative messages
    socket.on(EVENT_TYPES.REPRESENTATIVE_MESSAGE, ({ message, sessionInfo }) => {
      setSessionInfo(prev => ({ ...prev, ...sessionInfo }));
      
      // Prevent duplicate representative messages
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.type === MESSAGE_TYPES.REPRESENTATIVE && lastMessage.content === message) {
          return prev;
        }
        return [...prev, { 
          type: MESSAGE_TYPES.REPRESENTATIVE, 
          content: message, 
          isVerified: sessionInfo?.hasEmail,
          tags: sessionInfo?.tags || []
        }];
      });
    });

    return () => {
      socket.off('connect');
      socket.off(EVENT_TYPES.RESPONSE);
      socket.off(EVENT_TYPES.REALTIME);
      socket.off(EVENT_TYPES.APPOINTMENT);
      socket.off(EVENT_TYPES.ERROR);
      socket.off('handover');
      socket.off('ai-resume');
      socket.off('admin-response');
      socket.off('user-message');
      socket.off(EVENT_TYPES.REPRESENTATIVE_MESSAGE);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('message', inputMessage);
      setMessages(prev => [...prev, { 
        type: MESSAGE_TYPES.USER, 
        content: inputMessage,
        isVerified: sessionInfo.hasEmail
      }]);
      setInputMessage('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-96 h-[32rem] bg-white shadow-lg rounded-lg flex flex-col">
        <header className="bg-purple-600 text-white p-4 rounded-t-lg">
          <h1 className="text-lg font-bold">TechGadget Store AI Chatbot</h1>
          {sessionInfo.hasEmail && (
            <div className="text-sm mt-1">
              Verified User {sessionInfo.email}
            </div>
          )}
        </header>
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {!isConnected ? (
            <div className="text-center text-gray-500">
              Connecting to chat...
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={cn("p-2 my-2 rounded", {
                  "bg-blue-100 text-blue-900": message.type === MESSAGE_TYPES.USER,
                  "bg-green-100 text-green-900": message.type === MESSAGE_TYPES.ASSISTANT,
                  "bg-gray-200 text-gray-800": message.type === MESSAGE_TYPES.SYSTEM,
                  "bg-red-100 text-red-900": message.type === MESSAGE_TYPES.ERROR,
                  "bg-yellow-100 text-yellow-900": message.type === MESSAGE_TYPES.REPRESENTATIVE,
                  "bg-purple-100 text-purple-900": message.type === MESSAGE_TYPES.ADMIN,
                  "border-l-4 border-blue-500": message.isVerified,
                })}
              >
                <small className="block text-xs text-gray-500 mb-1">
                  {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                </small>
                {message.content}
                {message.tags?.length > 0 && (
                  <div className="mt-1">
                    {message.tags.map((tag, i) => (
                      <span key={i} className="inline-block bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-2 border-t flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={sessionInfo.hasEmail ? "Type your message..." : "Type your message or provide email..."}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;