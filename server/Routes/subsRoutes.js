import express from "express";
import Subscriber from "../Models/subsSchema.js";

const router = express.Router();

//@route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required." });
  }

  try {
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      res.status(400).json({ message: "Email is already subscribed." });
    }
    subscriber = await Subscriber.create({ email });
    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
