import  express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getEmailByBusinessId } from "../controllers/email.controller.js";

const router = express.Router();

router.get("/getemail/:businessOwnerId", verifyToken, getEmailByBusinessId);

export default router;



