import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: String,
    enum: [
      "monthly",
      "quarterly",
      "yearly",
      "lifetime"
    ],
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date
  },

  status: {
    type: String,
    enum: [
      "active",
      "expired",
      "cancelled",
      "pending"
    ],
    default: "pending"
  },

  autoRenew: {
    type: Boolean,
    default: false
  },

  swagEligible: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });


export default mongoose.model("Membership", membershipSchema);
