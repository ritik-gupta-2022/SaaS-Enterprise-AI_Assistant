import mongoose from "mongoose";
import Business from "../models/business.model.js";
import Campaign from "../models/campaign.model.js";
import Customer from "../models/customer.model.js";
import { errorHandler } from "../utils/error.js";

export const getEmailByBusinessId = async (req, res, next)=>{
    const userId = req.user.id;
    const businessOwnerId = req.params.businessOwnerId;
    console.log(req.params.businessId);
    if(!userId){
        return next(errorHandler(400, "You are not authorized"));
    }
    if(!businessOwnerId){
        return next(errorHandler(400, "Business owner ID is required"));
    }

    try{
        const business = await Business.find({businessOwnerId});
        if(!business){
            return next(errorHandler(404, "Business not found"));
        }

        const customers = await Customer.find({ businessOwnerId }).populate("businessId");
        console.log(customers);
        res.status(200).json(customers);
    }catch(err){
        console.log(err);
        next(err);
    }
}

export const createCampaign = async (req,res,next) =>{
    const userId = req.user.id;
    const name = req.body.name
    if(!name){
        return next(errorHandler(402, "Campaign name is required"));
    }
    try{
        const campaign = new Campaign({
            name,
            userId
        });
        
        await campaign.save();
        
        res.status(200).json(campaign);
    }catch(err){
        console.log(err);
        next(err);
    }
}

export const getCampaign = async(req,res,next) =>{
    const userId = req.user.id;
    try{
        const campaigns = await Campaign.find({userId});
        res.status(200).json(campaigns);
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

export const updateCampaign = async(req,res,next) =>{
    const { campaignId } = req.params;
    const newCampaign = req.body;

    console.log("Received campaignId:", campaignId);
    console.log("Request Body:", newCampaign);

    // Ensure campaignId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID format" });
    }

    try {
        const campaign = await Campaign.findById(campaignId,  );
        campaign.emails = newCampaign.emails;
        campaign.emailContent= newCampaign.emailContent;
        await campaign.save();
        res.status(200).json(campaign);
    }
    catch(err){
        console.log(err);
        next(err);
    }
}