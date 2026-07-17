import mongoose from "mongoose";
import Subscriber from "../models/Subscriber.js";

const requireDatabase = (res) => {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ message: "Database is not connected. Set MONGO_URI and restart the server." });
  return false;
};

// @desc  Subscribe to premium plan (get free swags)
// @route POST /api/subscribe
export const createSubscription = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const { name, email, phone, tshirtSize } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "You are already a premium runner!" });
    }

    const subscriber = await Subscriber.create({
      name,
      email,
      phone,
      tshirtSize,
    });

    res.status(201).json({
      message: "Welcome, Premium Runner! Your free swags are on the way.",
      subscriber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Get all subscribers (admin)
// @route GET /api/subscribe
export const getSubscribers = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
