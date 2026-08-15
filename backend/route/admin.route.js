import express from "express";
import { getAdminDashboard, updateAttendanceStatus } from "../controller/adminController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.route("/dashboard").get(getAdminDashboard);
router.route("/attendance/:attendanceId").patch(updateAttendanceStatus);

export default router;
