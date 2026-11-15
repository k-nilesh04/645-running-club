import express from "express";
import { sendVerificationOTP, verifyEmailOTP } from "../controller/verificationController.js";
import { verificationRateLimiter } from "../middlewares/authRateLimiter.js";

const router = express.Router();

router.route("/send-otp").post(verificationRateLimiter, sendVerificationOTP);
router.route("/verify-otp").post(verificationRateLimiter, verifyEmailOTP);

export default router;
