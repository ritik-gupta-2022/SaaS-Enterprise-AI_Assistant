import express from "express";
import Session from "../models/session.model.js";
import Appointment from "../models/appointment.model.js";
import Customer from "../models/customer.model.js";

const router = express.Router();

router.post("/customers", async (req, res) => {  // Changed from router.get to router.post
  console.log("Request body:", req.body); // Add logging to debug
    const { business } = req.body;
    const session = await Session.find({ businessId: { $in: business } }) // Filter sessions by business
    if (session) {
      res.status(200).send(session)
    } else {
      res.status(500).send("Failed to fetch customer sessions")
    }
})
router.post("/book", async (req, res) => {
  try {
    const {date, slot, email, businessId} = req.body;
    const customer = await Customer.findOne({email: email});
    
    if (!customer) {
      return res.status(400).send("Customer not found");
    }

    const appointment = new Appointment({
      date,
      slot,
      email,
      businessId,
      customerId: customer._id
    });
    
    await appointment.save();
    customer.appointment = customer.appointment || [];
    customer.appointment.push(appointment._id);
    await customer.save();
    
    res.status(200).send("Appointment booked successfully");
  } catch (error) {
    res.status(500).send("Error booking appointment: " + error.message);
  }
})

router.get("/notify", async (req, res) => {
    console.log("notified");
    res.status(200).send("Notification received");
})

export default router;
