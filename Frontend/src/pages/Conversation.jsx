import React, { useState, useEffect } from 'react';

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

const currentUser = {
  id: "current-user",
  name: "You",
  email: "you@example.com",
  status: "online",
}

const sampleChats = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Alice Green",
      email: "alice@example.com",
      status: "online",
    },
    messages: [
      {
        id: "1",
        content: "Hi there!",
        timestamp: new Date(2024, 0, 19, 3, 5),
        sender: { id: "user1", name: "Alice Green", email: "alice@example.com", status: "online" },
      },
      {
        id: "2",
        content: "How are you doing?",
        timestamp: new Date(2024, 0, 19, 3, 7),
        sender: { id: "current-user", name: "You", email: "you@example.com", status: "online" },
      },
    ],
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Bob Smith",
      email: "bob@example.com",
      status: "offline",
    },
    messages: [
      {
        id: "3",
        content: "Hello! Can you help me with something?",
        timestamp: new Date(2024, 0, 19, 2, 30),
        sender: { id: "user2", name: "Bob Smith", email: "bob@example.com", status: "offline" },
      },
    ],
  },
]

const domains = ["trial5.com", "example.com"]

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Conversation = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null)
  // const [selectedChat, setSelectedChat] = useState(null);
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
        // console.log(customers);
        // console.log(customers[0]);
        
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

  // const handleSelectChat = (customer) => {
  //   setSelectedChat(customer);
  // };

  // const handleSendMessage = () => {
  //   if (inputMessage.trim() && selectedChat) {
  //     const newMessage = {
  //       role: 'user',
  //       content: inputMessage,
  //       timestamp: new Date().toISOString()
  //     };
  //     setSelectedChat(prevChat => ({
  //       ...prevChat,
  //       chatHistory: [...prevChat.chatHistory, newMessage]
  //     }));
  //     setInputMessage('');
  //   }
  // };

  
  const [message, setMessage] = useState("")
  const [selectedDomain, setSelectedDomain] = useState(domains[0])
  const [isRealTimeChat, setIsRealTimeChat] = useState(false)

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      sender: currentUser,
    }

    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    })
    setMessage("")
  }
  

  return (
    <>
     <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-96 border-r flex flex-col">
        {/* Filter buttons */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-sm font-normal">
              <Mail className="h-4 w-4 mr-2" />
              Unread
            </Button>
            <Separator orientation="vertical" className="h-6 bg-[#c0bbe5]/20" />
            <Button variant="ghost" size="sm" className="text-sm font-normal">
              <Clock className="h-4 w-4 mr-2" />
              All
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-sm font-normal">
            <Star className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="bg-[#c0bbe5]/20" />
        {/* Domain selector */}
        <div className="p-4">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger>
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-[#c0bbe5]/20" />
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>
        {/* Chat list */}
        <ChatList chats={customers} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {selectedChat ? (
          <ChatHeader chat={selectedChat} />
        ) : (
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Conversation</h1>
              <p className="text-lg text-muted-foreground">View all the customer chats with the assistant and provide real time assistan.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="real-time-chat"
                checked={isRealTimeChat}
                onCheckedChange={setIsRealTimeChat}
                className="data-[state=checked]:bg-[#c0bbe5]"
              />
              <Label htmlFor="real-time-chat">Real-time Chat</Label>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {selectedChat ? (
            <div className="space-y-4">
              {selectedChat.chatHistory.map((msg) => (
                <ChatMessage key={msg._id} message={msg} isCurrentUser={msg.role === 'assistant'} email={selectedChat.email?.split("@")[0]} />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No Chat Selected</div>
          )}
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t bg-gray-50">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center space-x-2"
          >
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" className="bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-primary-foreground">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Conversation;