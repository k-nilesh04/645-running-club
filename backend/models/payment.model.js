import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Membership"
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  paymentMethod: {
    type: String,
    enum: [
      "upi",
      "card",
      "netbanking",
      "cash"
    ]
  },

  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },

  status: {
    type: String,
    enum: [
      "pending",
      "success",
      "failed",
      "refunded"
    ],
    default: "pending"
  },

  paidAt: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);