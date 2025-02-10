"use client"

import { useSelector } from "react-redux";
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState, useEffect } from 'react';
import { ChatbotSettings } from "./Chatbot-settings";

export function DomainSettings({ businessid }) {
  const { businesses, loading, error } = useSelector((state) => state.business);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [business, setBusiness] = useState({});

  useEffect(() => {
    const selectedBusiness = businesses.find((business) => business._id === businessid);
    if (selectedBusiness) {
      setBusiness(selectedBusiness);
    }
  }, [businessid, businesses]);

  const handleUpdate = () => {
    alert(`Updated to:
    Domain: ${business.domain}
    Contact No: ${business.contactNo}
    Description: ${business.description}
    Business Email: ${business.businessEmail}
    Business URL: ${business.businessUrl}
    Name: ${business.name}`);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"use client"
import React, { useEffect } from 'react';

const ChatbotIframe = () => {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    
    const iframeStyles = (styleString: string) => {
      const style = document.createElement('style');
      style.textContent = styleString;
      document.head.append(style);
    };
    
    iframeStyles(\`
      .chat-frame {
        position: fixed;
        bottom: 20px;
        right: 20px;
        border: none;
        z-index: 999;
      }
    \`);
  }, []);

  return null;
};

export default ChatbotIframe;`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBusiness((prevBusiness) => ({
      ...prevBusiness,
      [id]: value,
    }));
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Domain Settings</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleEditing}
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
      </div>
      <div className="space-y-4">
        <div className="flex space-x-2 px-4">

          <div className="space-y-2 w-1/5">
            <Label htmlFor="contactNo">Contact No</Label>
            <Input id="contactNo" value={business.contactNo || ''} onChange={handleChange} readOnly={!isEditing} />
          </div>
          <div className="space-y-2 w-1/5">
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input id="businessEmail" value={business.businessEmail || ''} onChange={handleChange} readOnly={!isEditing} />
          </div>
          <div className="space-y-2 w-1/5">
            <Label htmlFor="businessUrl">Business URL</Label>
            <Input id="businessUrl" value={business.businessUrl || ''} onChange={handleChange} readOnly={!isEditing} />
          </div>
          <div className="space-y-2 w-1/5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={business.name || ''} onChange={handleChange} readOnly={!isEditing} />
          </div>
        </div>
        <div className="space-y-2 px-4">
          <Label htmlFor="description">Description</Label>
          <textarea id="description" className="w-full p-2 border rounded" rows="4" value={business.description || ''} onChange={handleChange} readOnly={!isEditing}></textarea>
        </div>
        {isEditing && (
          <Button onClick={handleUpdate} className="bg-[#c0bbe5] hover:bg-[#7b6edd]">Update</Button>
        )}
        {/* Existing code snippet section */}
        <div className="space-y-2">
          <Label>Code snippet</Label>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code snippet into the header tag of your website
          </p>
          <pre className="relative rounded-lg bg-muted p-4">
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2"
              onClick={handleCopy}
            >
              <span className="sr-only">Copy code</span>
              {isCopied ? (
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
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
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
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                </svg>
              )}
            </Button>
            <code className="block text-sm">
              {`"use client"
import React, { useEffect } from 'react';

const ChatbotIframe = () => {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    
    const iframeStyles = (styleString: string) => {
      const style = document.createElement('style');
      style.textContent = styleString;
      document.head.append(style);
    };
    
    iframeStyles(\`
      .chat-frame {
        position: fixed;
        bottom: 20px;
        right: 20px;
        border: none;
        z-index: 999;
      }
    \`);
  }, []);

  return null;
};

export default ChatbotIframe;`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

