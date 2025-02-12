import mongoose from "mongoose";

const chatBotSchema = new mongoose.Schema(
  {
    welcomeMessage: { type: String, default: "How can I help you?" },
    icon: { type: String },
    background: { type: String },
    textColor: { type: String },
    helpdesk: { type: Boolean, default: false },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", unique: true },
  },
  { timestamps: true }
);

const ChatBot = mongoose.model("ChatBot", chatBotSchema);
export default ChatBot;
