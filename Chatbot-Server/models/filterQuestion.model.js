import mongoose from "mongoose";

const filterQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answered: { type: String },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  },
  { timestamps: true }
);

const FilterQuestions = mongoose.model("FilterQuestions", filterQuestionsSchema);
export default FilterQuestions;
