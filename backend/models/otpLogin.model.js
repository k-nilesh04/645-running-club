import mongoose from "mongoose";

const otpLoginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true },
    resendAvailableAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// MongoDB automatically removes expired challenges; handlers also check expiresAt.
otpLoginSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OtpLogin", otpLoginSchema);
