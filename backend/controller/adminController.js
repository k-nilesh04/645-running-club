import mongoose from "mongoose";
import Attendance from "../models/attendance.model.js";
import Membership from "../models/membership.model.js";
import Run from "../models/run.model.js";
import User from "../models/user.model.js";
import { summarizeAttendance } from "../utils/adminDashboard.js";

const getDateRange = (dateString) => {
  const targetDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const start = new Date(targetDate);
  const end = new Date(targetDate);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

export const getAdminDashboard = async (req, res) => {
  try {
    const selectedDate = req.query.date || new Date().toISOString().slice(0, 10);
    const dateRange = getDateRange(selectedDate);

    if (!dateRange) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const runsForDay = await Run.find({
      date: {
        $gte: dateRange.start,
        $lt: dateRange.end,
      },
    }).select("_id title date startTime location").lean();

    const runIds = runsForDay.map((run) => run._id);

    const attendanceRecords = await Attendance.find({
      run: { $in: runIds.length ? runIds : [null] },
    })
      .populate({
        path: "user",
        select: "name email city age gender profilePicture emergencyContact role",
      })
      .populate({
        path: "run",
        select: "title date startTime location",
      })
      .sort({ createdAt: -1 });

    const now = new Date();
    await Membership.updateMany(
      { status: "active", endDate: { $ne: null, $lte: now } },
      { $set: { status: "expired" } }
    );
    const users = await User.find({})
      .select("name email city role profilePicture createdAt")
      .sort({ createdAt: -1 }).lean();
    const allMemberships = await Membership.find({})
      .populate({ path: "user", select: "name email city role profilePicture" })
      .sort({ startDate: -1, createdAt: -1 }).lean();
    const latestByUser = new Map();
    for (const membership of allMemberships) {
      const userId = membership.user?._id?.toString();
      if (!userId || latestByUser.has(userId)) continue;
      const isExpiredByDate = membership.status === "active" && membership.endDate && new Date(membership.endDate) <= now;
      latestByUser.set(userId, {
        ...membership,
        effectiveStatus: isExpiredByDate ? "expired" : membership.status,
        daysRemaining: membership.endDate
          ? Math.max(0, Math.ceil((new Date(membership.endDate).getTime() - now.getTime()) / 86400000))
          : null,
      });
    }
    const memberSubscriptions = users.map((user) => ({
      user,
      latestSubscription: latestByUser.get(user._id.toString()) || null,
    }));
    const activeMemberships = allMemberships.filter((membership) =>
      membership.status === "active" && (!membership.endDate || new Date(membership.endDate) > now)
    );
    const summary = summarizeAttendance(attendanceRecords, activeMemberships.length);
    return res.status(200).json({
      success: true, date: selectedDate, summary,
      attendance: attendanceRecords, paidMembers: activeMemberships,
      memberSubscriptions, runs: runsForDay,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, checkInTime } = req.body;

    if (!mongoose.isValidObjectId(attendanceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance id",
      });
    }

    const validStatuses = ["registered", "present", "absent", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      {
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : new Date(),
      },
      { new: true }
    )
      .populate({
        path: "user",
        select: "name email city age gender profilePicture emergencyContact role",
      })
      .populate({
        path: "run",
        select: "title date startTime location",
      });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
