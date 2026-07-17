import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 100,
    },
    photo: {
      type: String,
      default: "",
    },
    runsCompleted: {
      type: Number,
      default: 0,
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
    memberSince: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
