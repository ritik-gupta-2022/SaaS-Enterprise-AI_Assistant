import  express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createCampaign, getCampaign, getEmailByBusinessId, updateCampaign } from "../controllers/email.controller.js";

const router = express.Router();

router.get("/getemail/:businessOwnerId", verifyToken, getEmailByBusinessId);
router.post("/createcampaign", verifyToken, createCampaign);
router.get("/getcampaign", verifyToken, getCampaign);
router.put("/updatecampaign/:campaignId", verifyToken, updateCampaign);


export default router;



