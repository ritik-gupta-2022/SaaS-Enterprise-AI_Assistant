import Business from "../models/business.model.js";
import ChatBot from "../models/chatbot.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { createChatbot } from "./chatbot.controller.js";

export const addBusiness = async (req,res,next) =>{
    const userId = req.user.id;

    const {name, businessUrl, description, contactNo, businessEmail} = req.body;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed to register a business"));
    }

    if(!name|| name.trim()==="" || !businessUrl || !businessUrl.trim()){
        return next(errorHandler(403, "All Fields are required"));
    }
    
    try{
        const user = await User.findById(userId);
        user.credit-=10;
        if(user.credit<0){
            return next(errorHandler(403, "Insufficient credit"));
        }
        
        const business = new Business({ userId ,name, businessUrl, description, contactNo, businessEmail});
        await business.save();

        user.businesses.push(business._id);
        await user.save();

        const chatbot = await createChatbot(userId, business._id);
        console.log(chatbot)
        business.chatBot = chatbot._id;

        await business.save();
        res.status(201).json({business , user});
    }
    catch(err){
        console.log(err)
        next(err);
    }
}

// user business
export const userBusiness = async (req,res,next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(errorHandler(404, "User not found"));
    }
    try{
        const businesses = await Business.find({userId});
        res.status(200).json(businesses);
    }catch(err){
        next(err);
    }
}

//get business by id
export const business = async (req, res, next) => {
    const businessId = req.body;

    if (!businessId) {
        return next(errorHandler(400, "Business ID is required"));
    }

    try {
        const business = await Business.findById(businessId);

        if (!business) {
            return next(errorHandler(404, "Business not found"));
        }
        res.status(200).json(business);
    } catch (err) {
        next(err);
    }
}

export const deleteBusiness = async (req, res, next) => {
    const businessId = req.params.businessId;
    const userId = req.user.id;

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Check if the business is associated with the user
        if (!user.businesses.includes(businessId)) {
            return next(errorHandler(403, "Business ID not associated with user"));
        }

        // Find the business
        const business = await Business.findById(businessId);
        if (!business) {
            return next(errorHandler(404, "Business not found"));
        }

        // Delete associated ChatBot(s), if any
        if (business.chatBot) {
            await ChatBot.deleteMany({ _id: { $in: business.chatBot } }); // Handles array or single reference
        }

        await business.deleteOne();

        user.businesses.pull(businessId);
        await user.save();

        res.status(200).json({ user });

    } 
    catch(err){
        next(err);
    }
};
