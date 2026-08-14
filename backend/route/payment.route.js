import express from "express";
import {
  initiatePayment,
  verifyPayment,
  getMembershipStatus,
  cancelMembership,
} from "../controller/paymentController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/initiate").post(isAuthenticated, initiatePayment);
router.route("/verify").post(isAuthenticated, verifyPayment);
router.route("/status").get(isAuthenticated, getMembershipStatus);
router.route("/cancel").post(isAuthenticated, cancelMembership);

export default router;
