import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    businessUrl:{ type:String, required:true},
    icon: { type: String },
    chatBot: { type: mongoose.Schema.Types.ObjectId, ref: "ChatBot" },
    helpdesk: [{ type: mongoose.Schema.Types.ObjectId, ref: "HelpDesk" }],
    filterQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "FilterQuestions" }],
    customer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaign: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    email: [{type: String}],
    appointmentUrl : {type:String},
    businessEmail: {type:String,required:true},
    description :{type:String,required:true},
    contactNo:{type:Number,required:true},
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);
export default Business;
