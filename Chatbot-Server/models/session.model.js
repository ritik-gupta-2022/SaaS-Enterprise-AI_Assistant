import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  roomId: String,
  chatHistory: [
    {
      role: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
})

const Session = mongoose.model("Session", sessionSchema);
export default Session;