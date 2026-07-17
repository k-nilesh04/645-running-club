import express from "express";
import { createSubscription, getSubscribers } from "../controllers/subscribeController.js";

const router = express.Router();

router.route("/").post(createSubscription).get(getSubscribers);

export default router;
