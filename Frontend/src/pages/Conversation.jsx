import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Mail, Clock, Star, Search, Paperclip, Send, MoreHorizontal, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatHeader } from "../components/conversation/ChatHeader"
import { ChatList } from "../components/conversation/ChatList"
import { ChatMessage } from "../components/conversation/ChatMessage"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CHAT_BACKEND_URL } from '../constant';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:5000');
const EVENT_TYPES = {
  RESPONSE: 'ai-response',
  REALTIME: 'realtime',
  APPOINTMENT: 'appointment',
  ERROR: 'error',
  HANDOVER: 'handover',
  AI_RESUME: 'ai-resume',
  REPRESENTATIVE_MESSAGE: 'representative-message',
  JOIN_AS_REPRESENTATIVE: 'joinAsRepresentative',
  LEAVE_AS_REPRESENTATIVE: 'leaveAsRepresentative',
  ADMIN_RESPONSE: 'admin-response'
};

const Conversation = () => {
  const {currentUser} = useSelector((state) => state.user);
  const businesses = useSelector((state) => state.business.businesses);
  const domains = businesses;
  const [customers, setCustomers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Initialize selectedDomain when businesses load
  useEffect(() => {
    if (domains && domains.length > 0 && !selectedDomain) {
      setSelectedDomain(domains[0]);
    }
  }, [domains]);

  // Fetch and filter customers when selectedDomain changes
  useEffect(() => {
    if (selectedDomain && currentUser) {
      fetch(`${CHAT_BACKEND_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({business: currentUser.businesses})
      })
        .then(response => response.json())
        .then(data => {
          const customersWithStatus = data.map(customer => ({
            ...customer,
            isOnline: false
          }));
          setCustomers(customersWithStatus);
          
          // Filter customers for selected domain
          const filtered = customersWithStatus.filter(customer => 
            customer.businessId === selectedDomain._id
          );
          setFilteredCustomers(filtered);

          // Check online status for each customer
          customersWithStatus.forEach(customer => {
            socket.emit('checkRoomStatus', customer.roomId, (response) => {
              setCustomers(prevCustomers => prevCustomers.map(c => 
                c.roomId === customer.roomId ? { ...c, isOnline: response.isActive } : c
              ));
            });
          });
        })
        .catch(error => console.error('Error fetching customers:', error));
    }
  }, [currentUser, selectedDomain]);

  useEffect(() => {
    const handleServerResponse = (data) => {
      if (selectedChat && data.sessionInfo?.email === selectedChat.email) {
        let role;
        if (data.sessionInfo.isAdmin) {
          role = 'admin';
        } else if (data.sessionInfo.type === 'representative') {
          role = 'representative';
        } else {
          role = data.sessionInfo.type;
        }

        setSelectedChat((prevChat) => ({
          ...prevChat,
          chatHistory: [
            ...prevChat.chatHistory,
            {
              role,
              content: data.message,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      }
    };

    const handleUserDisconnected = ({ roomId, email, timestamp }) => {
      if (selectedChat && email === selectedChat.email) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          chatHistory: [
            ...prevChat.chatHistory,
            {
              role: 'system',
              content: `User has disconnected at ${new Date(timestamp).toLocaleTimeString()}.`,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      }
    };

    socket.on(EVENT_TYPES.RESPONSE, handleServerResponse);
    socket.on(EVENT_TYPES.REALTIME, handleServerResponse);
    socket.on(EVENT_TYPES.APPOINTMENT, handleServerResponse);
    socket.on(EVENT_TYPES.HANDOVER, handleServerResponse);
    socket.on(EVENT_TYPES.AI_RESUME, handleServerResponse);
    socket.on(EVENT_TYPES.REPRESENTATIVE_MESSAGE, handleServerResponse);
    socket.on('user-message', ({ roomId, message, sessionInfo }) => {
      if (selectedChat && sessionInfo.email === selectedChat.email) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          chatHistory: [
            ...prevChat.chatHistory,
            {
              role: 'user',
              content: message,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      }
    });

    socket.on(EVENT_TYPES.ADMIN_RESPONSE, handleServerResponse);
    socket.on('user-disconnected', handleUserDisconnected);

    return () => {
      socket.off(EVENT_TYPES.RESPONSE, handleServerResponse);
      socket.off(EVENT_TYPES.REALTIME, handleServerResponse);
      socket.off(EVENT_TYPES.APPOINTMENT, handleServerResponse);
      socket.off(EVENT_TYPES.HANDOVER, handleServerResponse);
      socket.off(EVENT_TYPES.AI_RESUME, handleServerResponse);
      socket.off(EVENT_TYPES.REPRESENTATIVE_MESSAGE, handleServerResponse);
      socket.off('user-message');
      socket.off(EVENT_TYPES.ADMIN_RESPONSE, handleServerResponse);
      socket.off('user-disconnected');
    };
  }, [selectedChat]);

  const handleSelectChat = (customer) => {
    if (selectedChat && selectedChat.roomId !== customer.roomId) {
      socket.emit(EVENT_TYPES.LEAVE_AS_REPRESENTATIVE, selectedChat.roomId);
    }
    setSelectedChat(customer);
    socket.emit(EVENT_TYPES.JOIN_AS_REPRESENTATIVE, customer.roomId);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedChat) {
      socket.emit(EVENT_TYPES.REPRESENTATIVE_MESSAGE, { roomId: selectedChat.roomId, message: inputMessage });
      setSelectedChat((prevChat) => ({
        ...prevChat,
        chatHistory: [
          ...prevChat.chatHistory,
          {
            role: 'representative',
            content: inputMessage,
            timestamp: new Date().toISOString(),
          },
        ],
      }));
      setInputMessage('');
    }
  };

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat?.chatHistory]);

  return (
    <div className="flex h-screen bg-white">
      <div className="w-96 border-r flex flex-col">
        <div className="p-4">
          <Select value={selectedDomain?._id} onValueChange={(value) => {
            const domain = domains.find(d => d._id === value);
            setSelectedDomain(domain);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain._id} value={domain._id}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-[#c0bbe5]/20" />
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>
        <ChatList chats={filteredCustomers} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatHeader chat={selectedChat} />
        ) : (
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Conversation</h1>
              <p className="text-lg text-muted-foreground">View all the customer chats with the assistant and provide real time assistan.</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* <Switch
                id="real-time-chat"
                checked={isRealTimeChat}
                onCheckedChange={setIsRealTimeChat}
                className="data-[state=checked]:bg-[#c0bbe5]"
              /> */}
              <Label htmlFor="real-time-chat">Real-time Chat</Label>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          {selectedChat ? (
            <div className="space-y-4">
              {selectedChat.chatHistory.map((msg) => (
                <ChatMessage key={msg._id} message={msg} isCurrentUser={msg.role === 'assistant'||msg.role==='representative'} role={msg.role} email={selectedChat.email?.split("@")[0]} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No Chat Selected</div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-primary-foreground">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Conversation;