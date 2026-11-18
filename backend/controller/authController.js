import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import OtpLogin from "../models/otpLogin.model.js";
import { sendEmail } from "../utils/emailSender.js";
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


const OTP_LOGIN_TTL_MS = 10 * 60 * 1000;
const OTP_LOGIN_RESEND_MS = 60 * 1000;
const OTP_LOGIN_MAX_ATTEMPTS = 5;
const hashLoginOtp = (otp) => crypto.createHmac("sha256", process.env.JWT_SECRET || "645-run-club-otp-fallback").update(String(otp)).digest("hex");
const safeEqualHash = (candidate, expected) => {
  const left = Buffer.from(hashLoginOtp(candidate), "hex");
  const right = Buffer.from(expected || "", "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

export const sendLoginOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ email }).select("name email emailVerified");
    if (!user) {
      return res.status(404).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User does not exist. Please try another email address.",
      });
    }
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email address before using OTP login.",
      });
    }

    const existingChallenge = await OtpLogin.findOne({ email });
    if (existingChallenge?.expiresAt > new Date() && existingChallenge.resendAvailableAt > new Date()) {
      const seconds = Math.ceil((existingChallenge.resendAvailableAt - Date.now()) / 1000);
      res.set("Retry-After", String(seconds));
      return res.status(429).json({ success: false, message: `Please wait ${seconds} seconds before requesting another OTP.` });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    await sendEmail({
      to: email,
      subject: "Your 645 Run Club login code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;padding:28px;color:#17231b">
          <h2 style="margin:0 0 12px">645 Run Club</h2>
          <p>Hello ${String(user.name || "runner").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]))},</p>
          <p>Use this one-time code to sign in to your account:</p>
          <div style="font-size:34px;font-weight:700;letter-spacing:10px;text-align:center;padding:20px;background:#f4f0e4;border-radius:10px">${otp}</div>
          <p>This code expires in 10 minutes. Do not share it with anyone.</p>
          <p>If you did not request this code, you can ignore this email.</p>
        </div>
      `,
    });

    await OtpLogin.findOneAndUpdate(
      { email },
      {
        $set: {
          otpHash: hashLoginOtp(otp),
          expiresAt: new Date(Date.now() + OTP_LOGIN_TTL_MS),
          resendAvailableAt: new Date(Date.now() + OTP_LOGIN_RESEND_MS),
          attempts: 0,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ success: true, message: "A login OTP has been sent to your registered email address." });
  } catch (error) {
    console.error("Send login OTP error:", error.message || error);
    return res.status(502).json({ success: false, message: "We could not send your login OTP right now. Please try again later." });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    if (!EMAIL_PATTERN.test(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address and 6-digit OTP." });
    }

    const challenge = await OtpLogin.findOne({ email }).select("+otpHash");
    if (!challenge || challenge.expiresAt <= new Date()) {
      if (challenge) await OtpLogin.deleteOne({ _id: challenge._id });
      return res.status(400).json({ success: false, message: "OTP has expired. Request a new login OTP." });
    }

    if (!safeEqualHash(otp, challenge.otpHash)) {
      challenge.attempts += 1;
      if (challenge.attempts >= OTP_LOGIN_MAX_ATTEMPTS) {
        await OtpLogin.deleteOne({ _id: challenge._id });
        return res.status(429).json({ success: false, message: "Too many incorrect OTP attempts. Request a new code." });
      }
      await challenge.save();
      return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    const user = await User.findOne({ email }).select("name email role emailVerified");
    await OtpLogin.deleteOne({ _id: challenge._id });
    if (!user || !user.emailVerified) {
      return res.status(404).json({ success: false, message: "This account is unavailable. Please contact support." });
    }

    const token = createToken(user);
    return setAuthCookie(res, token).status(200).json({
      success: true,
      message: "Login successful.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Verify login OTP error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify your login OTP right now." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ success: true, message: "Logout successful" });
};
