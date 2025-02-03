import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    slot: { type: String, required: true },
    email: { type: String, required: true },
    status:{type:String , enum:['pending' , 'rejected', 'accepted'], default:'pending'},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;