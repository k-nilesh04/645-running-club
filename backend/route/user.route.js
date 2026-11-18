import express from "express";
import { getMyProfile, updateProfile } from "../controller/profileUpdate.js";
import { login, logout, signup, sendLoginOTP, verifyLoginOTP } from "../controller/authController.js";
import { authRateLimiter } from "../middlewares/authRateLimiter.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/profile").get(isAuthenticated, getMyProfile);
router.route("/profile/update").put(isAuthenticated, updateProfile);
router.route("/login").post(authRateLimiter, login);
router.route("/login/send-otp").post(authRateLimiter, sendLoginOTP);
router.route("/login/verify-otp").post(authRateLimiter, verifyLoginOTP);
router.route("/signup").post(authRateLimiter, signup);
router.route("/logout").post(isAuthenticated, logout);

export default router;
