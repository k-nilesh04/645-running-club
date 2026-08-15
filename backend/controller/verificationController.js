import User from "../models/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getEmailProvider, sendEmail } from "../utils/emailSender.js";

dotenv.config();

export { createEmailTransport } from "../utils/emailSender.js";

console.log(`Email provider: ${getEmailProvider() || "not configured"}`);

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const pendingSignups = new Map();

// Pending signups live in memory, so expired entries are dropped to avoid unbounded growth.
export const prunePendingSignups = () => {
  const now = new Date();

  for (const [email, pending] of pendingSignups) {
    if (pending.expiresAt < now) {
      pendingSignups.delete(email);
    }
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
          <p style="margin: 0 0 24px; font-size: 13px; color: #9ca3af; text-align: center;">
            This code expires in <strong style="color: #6b7280;">10 minutes</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; line-height: 1.5;">
            If you didn't create a 645 Run Club account, you can safely ignore this email.
          </p>
          <p style="margin: 20px 0 0; font-size: 14px; color: #111827;">
            Miles better together.<br />
            <strong>The 645 Run Club Team</strong>
          </p>
        </div>
        <p style="text-align: center; font-size: 11px; color: #d1d5db; margin: 16px 0 0;">
          &copy; ${new Date().getFullYear()} 645 Run Club. All rights reserved.
        </p>
      </div>
    `,
  });

  return code;
};

const sendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const pending = pendingSignups.get(normalizedEmail);

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Signup request not found or expired",
      });
    }

    if (pending.expiresAt < new Date()) {
      pendingSignups.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please signup again.",
      });
    }

    let otp;

    try {
      otp = await sendEmailVerificationCode({
        email: pending.email,
        otp: pending.otp,
        name: pending.name,
      });
    } catch (emailError) {
      console.error("Send OTP email error:", emailError.message || emailError);

      return res.status(502).json({
        success: false,
        message:
          "We could not send your verification email right now. Please try again in a few minutes.",
      });
    }

    pending.otp = otp;
    pending.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Send OTP Error:", error.message || error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send verification code",
    });
  }
};

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const pending = pendingSignups.get(normalizedEmail);

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Signup request not found or expired",
      });
    }

    if (pending.expiresAt < new Date()) {
      pendingSignups.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    if (pending.otp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      pendingSignups.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const createdUser = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      emailVerified: true,
    });

    pendingSignups.delete(normalizedEmail);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { id: createdUser._id, role: createdUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        emailVerified: createdUser.emailVerified,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify email",
    });
  }
};

export { sendVerificationOTP, verifyEmailOTP };
