import express from "express";
import { sendVerificationOTP, verifyEmailOTP } from "../controller/verificationController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/send-otp").post(isAuthenticated, sendVerificationOTP);
router.route("/verify-otp").post(isAuthenticated, verifyEmailOTP);


export default router;