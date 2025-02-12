import express from "express";
import { addfilterquestion, addhelpdesk, deleteFilterQuestion, deleteHelpDesk, getFilterQuestion, getHelpDesk } from "../controllers/chatbot.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addhelpdesk/:businessId", verifyToken,addhelpdesk);
router.get("/getHelpDesk/:businessId", getHelpDesk);	
router.delete("/deleteHelpDesk/:businessId/:helpDeskId", verifyToken, deleteHelpDesk);
router.post("/addfilterquestion/:businessId", verifyToken,addfilterquestion);
router.get("/getFilterQuestion/:businessId",getFilterQuestion);
router.delete("/deleteFilterQuestion/:businessId/:FilterQuestionId", verifyToken, deleteFilterQuestion);



export default router;