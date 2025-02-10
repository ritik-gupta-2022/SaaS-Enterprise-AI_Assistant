"use client";

import { useState } from "react";
import { ImageIcon, MessageSquare } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ChatPreview } from "./Chat-preview.jsx";

export function ChatbotSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [senderColor, setSenderColor] = useState("#c0bbe5");
  const [receiverColor, setReceiverColor] = useState("#FFFFFF");
  const [chatbotImage, setChatbotImage] = useState(
    "https://placehold.co/100x100"
  );
  const [chatbotName, setChatbotName] = useState("Sales Rep - Damian A");
  const [chatBgColor, setChatBgColor] = useState("#F0F0F0");
  const [botBgColor, setBotBgColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#000000");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatbotImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    alert("Updated!");
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">
          Chatbot Settings
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
          >
            <span className="sr-only">Edit</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </Button>
        </h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex gap-4 w-full">
            <div className="grid gap-6 md:grid-cols-2 w-full">
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label>Chatbot icon</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="chatbotName">Chatbot Name:</Label>
                  <Input
                    id="chatbotName"
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="senderColor">Sender Chat Color:</Label>
                    <Input
                      id="senderColor"
                      type="color"
                      value={senderColor}
                      onChange={(e) => setSenderColor(e.target.value)}
                      className="h-10 w-full"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiverColor">Receiver Chat Color:</Label>
                    <Input
                      id="receiverColor"
                      type="color"
                      value={receiverColor}
                      onChange={(e) => setReceiverColor(e.target.value)}
                      className="h-10 w-full"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chatBgColor">Chat Background Color:</Label>
                    <Input
                      id="chatBgColor"
                      type="color"
                      value={chatBgColor}
                      onChange={(e) => setChatBgColor(e.target.value)}
                      className="h-10 w-full"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="botBgColor">Bot Background Color:</Label>
                    <Input
                      id="botBgColor"
                      type="color"
                      value={botBgColor}
                      onChange={(e) => setBotBgColor(e.target.value)}
                      className="h-10 w-full"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color:</Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-full"
                      disabled={!isEditing}
                    />
                  </div>
                 
                </div>
                <div className="space-y-2">
          <Label htmlFor="greeting">Greeting message</Label>
          <p className="text-sm text-muted-foreground">
            Customize your welcome message
          </p>
          <Textarea
            id="greeting"
            placeholder="Hey there, have a question? Text us here"
            className="min-h-[100px]"
            readOnly={!isEditing}
          />
        </div>
                {isEditing && (
                  <Button
                    onClick={handleUpdate}
                    className="bg-[#c0bbe5] w-full hover:bg-[#7b6edd]"
                  >
                    Update
                  </Button>
                )}
              </div>
              <div className="flex h-auto overflow-scroll justify-center items-center">
                <ChatPreview
                  senderColor={senderColor}
                  receiverColor={receiverColor}
                  chatbotImage={chatbotImage}
                  chatbotName={chatbotName}
                  botBgColor={botBgColor}
                  chatBgColor={chatBgColor}
                  textColor={textColor}
                />
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
