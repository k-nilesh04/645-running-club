import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((error) => {
    if (error) {
      console.error("Email transporter error:", error.message);
    } else {
      console.log("Email transporter is ready");
    }
  });
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmailVerificationCode = async (user) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service not configured");
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified");
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.emailVerificationCode = otp;
  user.emailVerificationExpires = expiresAt;

  await user.save();

  await transporter.sendMail({
    from: `"645 Run Club" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify your 645 Run Club account",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
        <div style="background: #111827; padding: 28px 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">645 Run Club</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
          <h2 style="margin: 0 0 8px; font-size: 20px; color: #111827;">Verify your email</h2>
          <p style="margin: 0 0 24px; font-size: 15px; color: #6b7280; line-height: 1.5;">
            Use the code below to verify your email address and finish setting up your account.
          </p>
          <div style="font-size: 34px; font-weight: 700; letter-spacing: 10px; text-align: center; padding: 22px 10px; background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 10px; color: #111827; margin: 0 0 20px;">
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
};

const sendVerificationOTP = async (req, res) => {
  try {
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

    await sendEmailVerificationCode(user);

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

    if (user.emailVerificationCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

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
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

export { sendVerificationOTP, verifyEmailOTP };
