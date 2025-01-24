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

function Chatbot() {
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
    <div className="text-center font-sans">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">TechGadget Store AI Chatbot</h1>
        {sessionInfo.hasEmail && (
          <div className="mt-2 text-sm text-gray-300">
            Verified User {sessionInfo.email}
          </div>
        )}
      </header>
      <div className="max-w-2xl mx-auto p-4">
        <div className="h-96 overflow-y-auto border border-gray-300 p-4 rounded mb-4">
          {!isConnected ? (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              Connecting to chat...
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-2 rounded mb-2 ${
                  message.type === MESSAGE_TYPES.USER
                    ? 'bg-blue-100 text-right'
                    : message.type === MESSAGE_TYPES.ASSISTANT
                    ? 'bg-gray-100 text-left'
                    : message.type === MESSAGE_TYPES.SYSTEM
                    ? 'bg-red-50 text-center'
                    : 'bg-red-200 text-red-800 text-center'
                }`}
              >
                {message.content}
                {message.tags?.length > 0 && (
                  <div className="mt-2 text-sm flex flex-wrap gap-2">
                    {message.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                      >
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
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={sessionInfo.hasEmail ? "Type your message..." : "Type your message or provide email..."}
            className="flex-grow p-2 border border-gray-300 rounded-l text-gray-700"
          />
          <button 
            type="submit" 
            className="p-2 bg-green-500 text-white rounded-r hover:bg-green-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
