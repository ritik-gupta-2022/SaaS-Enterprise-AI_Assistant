import mongoose from "mongoose";

const helpDeskSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  { timestamps: true }
);

const HelpDesk = mongoose.model("HelpDesk", helpDeskSchema);
export default HelpDesk;
