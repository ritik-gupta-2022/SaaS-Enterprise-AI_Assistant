import Business from "../models/business.model.js";
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