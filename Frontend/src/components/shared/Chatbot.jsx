import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error'
};

const EVENT_TYPES = {
  RESPONSE: 'ai-response',
  REALTIME: 'realtime',
  APPOINTMENT: 'appointment',
  ERROR: 'error'
};

function Chat() {
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
        content: message,
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
        },
        { 
          type: MESSAGE_TYPES.SYSTEM, 
          content: `Realtime chat: ${link}`,
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

    return () => {
      socket.off('connect');
      socket.off(EVENT_TYPES.RESPONSE);
      socket.off(EVENT_TYPES.REALTIME);
      socket.off(EVENT_TYPES.APPOINTMENT);
      socket.off(EVENT_TYPES.ERROR);
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full bg-blue-600 text-white py-4 text-center">
        <h1 className="text-xl font-bold">TechGadget Store AI Chatbot</h1>
        {sessionInfo.hasEmail && (
          <div className="mt-2 text-sm">Verified User {sessionInfo.email}</div>
        )}
      </header>
      <div className="flex flex-col w-full max-w-xl bg-white shadow-lg rounded-lg p-4 mt-6">
        <div className="flex flex-col h-96 overflow-y-auto border border-gray-300 p-2 rounded-md">
          {!isConnected ? (
            <div className="text-center text-gray-500">Connecting to chat...</div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-2 mb-2 rounded-md text-sm ${
                  message.type === MESSAGE_TYPES.USER ? 'bg-blue-100 text-right' : 
                  message.type === MESSAGE_TYPES.ASSISTANT ? 'bg-gray-100 text-left' : 
                  message.type === MESSAGE_TYPES.SYSTEM ? 'bg-yellow-100 text-center' : 
                  'bg-red-100 text-red-600 text-center'
                }`}
              >
                {message.content}
                {message.tags?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {message.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 text-xs rounded-md">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex mt-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={sessionInfo.hasEmail ? "Type your message..." : "Type your message or provide email..."}
            className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
