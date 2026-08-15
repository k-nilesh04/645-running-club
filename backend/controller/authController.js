import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  pendingSignups,
  generateOTP,
  sendEmailVerificationCode,
  prunePendingSignups,
} from "./verificationController.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // Check required fields
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    prunePendingSignups();

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pendingSignups.set(normalizedEmail, {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      expiresAt,
    });

    try {
      await sendEmailVerificationCode({
        email: normalizedEmail,
        otp,
        name,
      });
    } catch (emailError) {
      pendingSignups.delete(normalizedEmail);
      console.error("Signup email error:", emailError.message || emailError);

      return res.status(502).json({
        success: false,
        message:
          "We could not send your verification email right now. Please try again in a few minutes.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Verification code sent to your email.",
      requiresEmailVerification: true,
      user: {
        name,
        email: normalizedEmail,
        emailVerified: false,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // Check fields
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = createToken(user);
    return res
      .status(200)
      .cookie("token", token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        token,
      });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


// =========================
// LOGOUT
// =========================
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", cookieOptions)
      .json({
        success: true,
        message: "Logout successful",
      });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
