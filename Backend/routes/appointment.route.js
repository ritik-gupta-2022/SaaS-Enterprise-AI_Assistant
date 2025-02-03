import  express  from "express";
import  {getAppointments}  from "../controllers/appointments.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();


router.get("/appointments",verifyToken,getAppointments);

export default router;



