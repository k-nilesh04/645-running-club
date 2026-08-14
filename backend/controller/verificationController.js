import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error.message);
  } else {
    console.log("Email transporter is ready");
  }
});

// GENERATE OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// SEND VERIFICATION OTP
const sendVerificationOTP = async (req, res) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(
        "Email credentials not configured. Set EMAIL_USER and EMAIL_PASS in .env",
      );
      return res.status(500).json({
        success: false,
        message: "Email service not configured",
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationCode = otp;
    user.emailVerificationExpires = expiresAt;

    await user.save();

    // Send email
    await transporter.sendMail({
      from: `"645 Run Club" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your 645 Run Club account",
      html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
      
      <!-- Header band -->
      <div style="background: #111827; padding: 28px 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
          645 Run Club 🏃
        </p>
      </div>

      <!-- Body -->
      <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
        
        <h2 style="margin: 0 0 8px; font-size: 20px; color: #111827;">Verify your email</h2>
        <p style="margin: 0 0 24px; font-size: 15px; color: #6b7280; line-height: 1.5;">
          Use the code below to verify your email address and finish setting up your account.
        </p>

        <!-- OTP block -->
        <div style="
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 10px;
          text-align: center;
          padding: 22px 10px;
          background: #f9fafb;
          border: 1px dashed #d1d5db;
          border-radius: 10px;
          color: #111827;
          margin: 0 0 20px;
        ">
          ${otp}
        </div>

        <p style="margin: 0 0 24px; font-size: 13px; color: #9ca3af; text-align: center;">
          This code expires in <strong style="color: #6b7280;">10 minutes</strong>.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <p style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; line-height: 1.5;">
          If you didn't create a 645 Run Club account, you can safely ignore this email.
        </p>
        <p style="margin: 20px 0 0; font-size: 14px; color: #111827;">
          Keep running 🏃‍♂️<br />
          <strong>The 645 Run Club Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <p style="text-align: center; font-size: 11px; color: #d1d5db; margin: 16px 0 0;">
        © ${new Date().getFullYear()} 645 Run Club. All rights reserved.
      </p>
    </div>
  `,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Send OTP Error:", error.message || error);

    // Log more details for debugging
    if (error.code === "EAUTH") {
      console.error(
        "Gmail authentication failed. Check EMAIL_USER and EMAIL_PASS",
      );
    } else if (error.code === "ENOTFOUND") {
      console.error("SMTP server not found. Check internet connection");
    }

    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
};

// VERIFY OTP
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Check OTP
    if (user.emailVerificationCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Check expiry
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    user.emailVerified = true;

    // Clear OTP after successful verification
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

export { sendVerificationOTP, verifyEmailOTP };
