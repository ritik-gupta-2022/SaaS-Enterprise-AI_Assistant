import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Appointment from "../models/appointment.model.js";


export const getAppointments = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const appointments = await Appointment.find({
            businessId: { $in: user.businesses }
        });

        if (!appointments) {
            return res.status(200).json([]);
        }

        // Send just the appointments array directly
        res.status(200).json(appointments);

    } catch (error) {
        next(errorHandler(500, 'Error fetching appointments'));
    }
};
