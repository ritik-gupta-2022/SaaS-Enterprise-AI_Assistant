import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  email: { type: String },
  roomId: String,
  chatHistory: [
    {
      role: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", }
})
sessionSchema.index({ email: 1, businessId: 1 }, { unique: true });
const Session = mongoose.model("Session", sessionSchema);
export default Session;