import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emails: [{ type: String }],
    business: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],
    emailContent: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
