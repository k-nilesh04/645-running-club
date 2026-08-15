import express from "express";
import { sendVerificationOTP, verifyEmailOTP } from "../controller/verificationController.js";

const router = express.Router();

router.route("/send-otp").post(sendVerificationOTP);
router.route("/verify-otp").post(verifyEmailOTP);


export default router;