import Business from "../models/business.model.js";
import ChatBot from "../models/chatbot.model.js";
import FilterQuestions from "../models/filterQuestion.model.js";
import HelpDesk from "../models/helpDesk.model.js";

export const createChatbot = async(userId , businessId) =>{

   try{
    const chatbot = new ChatBot({ businessId});
    await chatbot.save();

    return chatbot;
   }
   catch(err){
    return err;
   }
}

export const addhelpdesk = async (req, res, next) => {

      const businessId = req.params.businessId;
      const {question , answer} = req.body;
      
      if(question.trim() === "" || answer.trim() === ""){
        return next(errorHandler(400, "All fields are required"));
      }

      try {
         const business = await Business.findById(businessId);
         if (!business) {
            return next(errorHandler(404, "Business not found"));
         }
         const helpdesk = new HelpDesk({
            question,
            answer,
            businessId
         })
         await helpdesk.save();

         business.helpdesk.push(helpdesk._id);
         await business.save();
         
         res.status(201).json(helpdesk);
      }
      catch(err){
        next(err);
      }
}

export const getHelpDesk = async (req, res, next) => {
   const businessId = req.params.businessId;
   try {
      const business = await Business.findById(businessId).populate("helpdesk");
      if (!business) {
         return next(errorHandler(404, "Business not found"));
      }
      res.status(200).json(business.helpdesk);
   }
   catch(err){
      next(err);
   }
}

export const deleteHelpDesk = async (req, res, next) => {   
   const helpDeskId = req.params.helpDeskId;
   const businessId = req.params.businessId;
   try {
      const business = await Business.findById(businessId);
      if (!business) {
         return next(errorHandler(404, "Business not found"));
      }
      const helpdesk = await HelpDesk.findById(helpDeskId);
      if (!helpdesk) {
         return next(errorHandler(404, "HelpDesk not found"));
      }
      await HelpDesk.findByIdAndDelete(helpDeskId);
      business.helpdesk.pull(helpDeskId);
      await business.save();
      res.status(200).json(helpdesk);
   }
   catch(err){
      next(err);
   }
}

export const addfilterquestion = async(req,res,next)=>{
   const businessId = req.params.businessId;
   const {question} = req.body;

   if(question.trim() === ""){
      return next(errorHandler(400, "All fields are required"));
   }

   try{
      const business = await Business.findById(businessId);
      if (!business) {
         return next(errorHandler(404, "Business not found"));
      }
      const filterQuestion = new FilterQuestions({
         question,
         businessId
      });
      await filterQuestion.save();
      business.filterQuestions.push(filterQuestion._id);
      await business.save();
      res.status(201).json(filterQuestion);
   }
   catch(err){
      next(err);
   }
}

export const getFilterQuestion = async (req, res, next) => {
   const businessId = req.params.businessId;
   try {
      const business = await Business.findById(businessId).populate("filterQuestions");
      if (!business) {
         return next(errorHandler(404, "Business not found"));
      }
      res.status(200).json(business.filterQuestions);
   }
   catch(err){
      next(err);
   }
}