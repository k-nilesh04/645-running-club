import crypto from "node:crypto";
import User from "../models/user.model.js";
import { getEmailProvider, sendEmail } from "../utils/emailSender.js";
import { createToken, setAuthCookie } from "./authController.js";

export { createEmailTransport } from "../utils/emailSender.js";

console.log(`Email provider: ${getEmailProvider() || "not configured"}`);

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

export const generateOTP = () => crypto.randomInt(100000, 1000000).toString();
export const pendingSignups = new Map();

export const prunePendingSignups = () => {
  const now = new Date();
  for (const [email, pending] of pendingSignups) {
    if (pending.expiresAt < now) pendingSignups.delete(email);
  }
};

export const sendEmailVerificationCode = async ({ email, otp, name }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const code = otp || generateOTP();

  await sendEmail({
    to: normalizedEmail,
    subject: "Verify your 645 Run Club account",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
        <div style="background: #111827; padding: 28px 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">645 Run Club</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
          <h2 style="margin: 0 0 8px; font-size: 20px; color: #111827;">Verify your email</h2>
          <p style="margin: 0 0 24px; font-size: 15px; color: #6b7280; line-height: 1.5;">
            Hi ${name || "runner"}, use the code below to verify your email address and finish setting up your account.
          </p>
          <div style="font-size: 34px; font-weight: 700; letter-spacing: 10px; text-align: center; padding: 22px 10px; background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 10px; color: #111827; margin: 0 0 20px;">
            ${code}
          </div>
          <p style="margin: 0 0 24px; font-size: 13px; color: #9ca3af; text-align: center;">This code expires in <strong style="color: #6b7280;">10 minutes</strong>.</p>
          <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">If you didn't create a 645 Run Club account, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });

  return code;
};

const validOtp = (provided, expected) => {
  const candidate = Buffer.from(String(provided || "").trim());
  const actual = Buffer.from(String(expected || ""));
  return candidate.length === actual.length && crypto.timingSafeEqual(candidate, actual);
};

const sendVerificationOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const pending = pendingSignups.get(email);

    if (!pending || pending.expiresAt < new Date()) {
      pendingSignups.delete(email);
      return res.status(400).json({ success: false, message: "Signup request not found or expired" });
    }

    const now = new Date();
    if (pending.resendAvailableAt && pending.resendAvailableAt > now) {
      const seconds = Math.ceil((pending.resendAvailableAt - now) / 1000);
      res.set("Retry-After", String(seconds));
      return res.status(429).json({ success: false, message: `Please wait ${seconds} seconds before requesting another code.` });
    }

    const otp = generateOTP();
    await sendEmailVerificationCode({ email: pending.email, otp, name: pending.name });
    pending.otp = otp;
    pending.attempts = 0;
    pending.expiresAt = new Date(Date.now() + OTP_TTL_MS);
    pending.resendAvailableAt = new Date(Date.now() + RESEND_COOLDOWN_MS);

    return res.status(200).json({ success: true, message: "Verification code sent to your email" });
  } catch (error) {
    console.error("Send OTP Error:", error.message || error);
    return res.status(502).json({ success: false, message: "We could not send a verification email right now." });
  }
};

const verifyEmailOTP = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    const pending = pendingSignups.get(email);

    if (!pending || pending.expiresAt < new Date()) {
      pendingSignups.delete(email);
      return res.status(400).json({ success: false, message: "Verification code is invalid or has expired" });
    }

    if (!/^\d{6}$/.test(otp) || !validOtp(otp, pending.otp)) {
      pending.attempts = (pending.attempts || 0) + 1;
      if (pending.attempts >= MAX_OTP_ATTEMPTS) pendingSignups.delete(email);
      return res.status(400).json({
        success: false,
        message: pending.attempts >= MAX_OTP_ATTEMPTS
          ? "Too many incorrect codes. Please sign up again."
          : "Verification code is invalid or has expired",
      });
    }

    const existingUser = await User.exists({ email });
    if (existingUser) {
      pendingSignups.delete(email);
      return res.status(409).json({ success: false, message: "An account already exists for this email." });
    }

    const createdUser = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      emailVerified: true,
    });
    pendingSignups.delete(email);

    const token = createToken(createdUser);
    return setAuthCookie(res, token).status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify your email right now." });
  }
};

export { sendVerificationOTP, verifyEmailOTP };
