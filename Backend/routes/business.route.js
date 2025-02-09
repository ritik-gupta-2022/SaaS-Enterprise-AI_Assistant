import  express  from "express";
import  { addBusiness,userBusiness,deleteBusiness, updateBusiness}  from "../controllers/business.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addbusiness", verifyToken, addBusiness);
router.get("/myBusiness",verifyToken, userBusiness);
router.delete("/removebusiness/:businessId",verifyToken, deleteBusiness);
router.put("/updatebusiness/:businessId",verifyToken, updateBusiness);

// router.post("/google", google);
export default router;



