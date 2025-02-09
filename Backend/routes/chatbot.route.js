import express from "express";
import { addhelpdesk, getHelpDesk } from "../controllers/chatbot.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addhelpdesk/:businessId", verifyToken,addhelpdesk);
router.get("/getHelpDesk/:businessId", getHelpDesk);	


export default router;