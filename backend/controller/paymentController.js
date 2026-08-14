import Membership from "../models/membership.model.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";

// Initiate payment (for Razorpay or similar gateway)
export const initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, amount } = req.body;

    if (!plan || !amount) {
      return res.status(400).json({
        success: false,
        message: "Plan and amount are required",
      });
    }

    // Check if user already has an active membership
    const existingMembership = await Membership.findOne({
      user: userId,
      status: "active",
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: "You already have an active membership",
      });
    }

    // Create a pending membership
    const membership = await Membership.create({
      user: userId,
      plan,
      price: amount,
      startDate: new Date(),
      status: "pending",
      autoRenew: true,
    });

    // Create a pending payment record
    const payment = await Payment.create({
      user: userId,
      membership: membership._id,
      amount,
      currency: "INR",
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Payment initiated",
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        userId: userId,
      },
      membership: membership._id,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Verify payment and activate membership
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentId, membershipId, transactionId } = req.body;

    if (!paymentId || !membershipId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and Membership ID are required",
      });
    }

    // Update payment status to success
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: "success",
        transactionId: transactionId,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Calculate end date based on plan
    const startDate = new Date();
    let endDate = new Date();

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    if (membership.plan === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (membership.plan === "quarterly") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (membership.plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (membership.plan === "lifetime") {
      endDate = null;
    }

    // Update membership status to active
    const updatedMembership = await Membership.findByIdAndUpdate(
      membershipId,
      {
        status: "active",
        startDate: startDate,
        endDate: endDate,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and membership activated",
      membership: updatedMembership,
      payment: payment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get user's membership status
export const getMembershipStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const membership = await Membership.findOne({
      user: userId,
      status: "active",
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        hasMembership: false,
        message: "No active membership found",
      });
    }

    return res.status(200).json({
      success: true,
      hasMembership: true,
      membership: {
        id: membership._id,
        plan: membership.plan,
        price: membership.price,
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status,
      },
    });
  } catch (error) {
    console.error("Get membership error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Cancel membership
export const cancelMembership = async (req, res) => {
  try {
    const userId = req.user.id;

    const membership = await Membership.findOneAndUpdate(
      { user: userId, status: "active" },
      { status: "cancelled" },
      { new: true }
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "No active membership found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Membership cancelled successfully",
      membership,
    });
  } catch (error) {
    console.error("Cancel membership error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
