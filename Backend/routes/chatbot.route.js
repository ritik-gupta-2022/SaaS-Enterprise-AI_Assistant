import express from "express";
import { addfilterquestion, addhelpdesk, deleteHelpDesk, getFilterQuestion, getHelpDesk } from "../controllers/chatbot.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addhelpdesk/:businessId", verifyToken,addhelpdesk);
router.get("/getHelpDesk/:businessId", getHelpDesk);	
router.delete("/deleteHelpDesk/:businessId/:helpDeskId", verifyToken, deleteHelpDesk);
router.post("/addfilterquestion/:businessId", verifyToken,addfilterquestion);
router.get("/addfilterquestion/:businessId",getFilterQuestion);


export default router;