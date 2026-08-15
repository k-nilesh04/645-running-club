import express from "express";
import { getMyProfile, updateProfile } from "../controller/profileUpdate.js";
import { login, logout, signup } from "../controller/authController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/profile").get(isAuthenticated, getMyProfile);
router.route("/profile/update").put(isAuthenticated, updateProfile);
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").post(isAuthenticated, logout);

export default router;

