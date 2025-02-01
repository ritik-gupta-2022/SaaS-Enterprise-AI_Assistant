import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    email: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "CustomerResponses" }],
    session: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    appointment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;