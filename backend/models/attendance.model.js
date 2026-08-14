import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  run: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Run",
    required: true
  },

  status: {
    type: String,
    enum: [
      "registered",
      "present",
      "absent",
      "cancelled"
    ],
    default: "registered"
  },

  checkInTime: {
    type: Date
  },

  distanceCompleted: {
    type: Number
  }

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);