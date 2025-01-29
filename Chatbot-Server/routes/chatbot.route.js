import express from "express";
import Session from "../models/session.model.js";

const router = express.Router();

router.get("/customers", async (req, res) => {
    console.log("hil")
    const session = await Session.find()
    if (session) {
      res.status(200).send(session)
    } else {
      res.status(500).send("Failed to fetch customer sessions")
    }
})

router.get("/notify", async (req, res) => {
    console.log("notified");
    res.status(200).send("Notification received");
})

export default router;
