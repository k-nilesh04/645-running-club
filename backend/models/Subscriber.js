import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["monthly"],
      default: "monthly",
    },
    tshirtSize: {
      type: String,
      enum: ["S", "M", "L", "XL", "XXL"],
      default: "M",
    },
    swagClaimed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscriber", subscriberSchema);
