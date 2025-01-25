import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Conversation = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/customers')
      .then(response => response.json())
      .then(data => {
        const customersWithStatus = data.map(customer => ({
          ...customer,
          isOnline: false
        }));
        setCustomers(customersWithStatus);
        customersWithStatus.forEach(customer => {
          socket.emit('checkRoomStatus', customer.roomId, (response) => {
            setCustomers(prevCustomers => prevCustomers.map(c => 
              c.roomId === customer.roomId ? { ...c, isOnline: response.isActive } : c
            ));
          });
        });
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleSelectChat = (customer) => {
    setSelectedChat(customer);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedChat) {
      const newMessage = {
        role: 'user',
        content: inputMessage,
        timestamp: new Date().toISOString()
      };
      setSelectedChat(prevChat => ({
        ...prevChat,
        chatHistory: [...prevChat.chatHistory, newMessage]
      }));
      setInputMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300 bg-gray-100 p-4">
        {customers.map((customer, index) => (
          <div
            key={index}
            onClick={() => handleSelectChat(customer)}
            className={`cursor-pointer p-2 rounded-md mb-2 transition-colors ${selectedChat === customer ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          >
            {customer.email} <span className={`text-sm ${customer.isOnline ? 'text-green-500' : 'text-red-500'}`}>{customer.isOnline ? '(Online)' : '(Offline)'}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col p-4">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">Chat with {selectedChat.email}</h2>
            <div className="flex-1 overflow-y-auto mb-4">
              {selectedChat.chatHistory.map((message, index) => (
                <div key={index} className={`mb-2 p-2 rounded-md ${message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  <p className="font-semibold">{message.role}:</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center m-auto">Please select a chat from the list.</div>
        )}
      </div>
    </div>
  );
};

export default Conversation;