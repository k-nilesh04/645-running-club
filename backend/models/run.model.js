import mongoose from "mongoose";

const runSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  date: {
    type: Date,
    required: true
  },

  startTime: {
    type: String,
    required: true
  },

  location: {
    name: String,
    address: String
  },

  distance: {
    type: Number
  },

  maxParticipants: {
    type: Number
  },

  status: {
    type: String,
    enum: [
      "upcoming",
      "ongoing",
      "completed",
      "cancelled"
    ],
    default: "upcoming"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Run", runSchema);