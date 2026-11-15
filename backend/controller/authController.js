import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  pendingSignups,
  generateOTP,
  sendEmailVerificationCode,
  prunePendingSignups,
} from "./verificationController.js";

import { createToken, setAuthCookie, cookieOptions } from "../utils/authSession.js";

const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSignup = ({ name, email, password }) => {
  if (!name || !email || !password) return "Name, email and password are required";
  if (name.length < 2 || name.length > 80) return "Please enter a name between 2 and 80 characters";
  if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address";
  if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Use at least 12 characters with uppercase, lowercase, and a number";
  }
  return null;
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const validationError = validateSignup({ name, email, password });

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists for this email. Please sign in instead.",
      });
    }

    prunePendingSignups();

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pendingSignups.set(email, {
      name,
      email,
      password: hashedPassword,
      otp,
      expiresAt,
      attempts: 0,
      resendAvailableAt: new Date(Date.now() + 60 * 1000),
    });

    try {
      await sendEmailVerificationCode({ email, otp, name });
    } catch (emailError) {
      pendingSignups.delete(email);
      console.error("Signup email error:", emailError.message || emailError);
      return res.status(502).json({
        success: false,
        message: "We could not send your verification email right now. Please try again in a few minutes.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Check your email for a verification code.",
      requiresEmailVerification: true,
      user: { name, email, emailVerified: false },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ success: false, message: "Unable to create an account right now." });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!EMAIL_PATTERN.test(email) || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password +loginAttempts +loginLockUntil");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.loginLockUntil && user.loginLockUntil > new Date()) {
      return res.status(429).json({ success: false, message: "Too many sign-in attempts. Please try again later." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const attempts = (user.loginAttempts || 0) + 1;
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            loginAttempts: attempts,
            loginLockUntil: attempts >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOGIN_LOCK_MS) : null,
          },
        },
      );
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    await User.updateOne(
      { _id: user._id },
      { $set: { loginAttempts: 0, loginLockUntil: null } },
    );

    const token = createToken(user);
    return setAuthCookie(res, token).status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Unable to sign in right now." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ success: true, message: "Logout successful" });
};
