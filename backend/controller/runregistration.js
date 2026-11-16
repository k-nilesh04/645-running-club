import mongoose from "mongoose";
import Run from "../models/run.model.js";
import Attendance from "../models/attendance.model.js";

const invalidRunIdResponse = (res) =>
  res.status(400).json({
    success: false,
    message: "Invalid run id"
  });

// Create a new run (admin only)
export const createRun = async (req, res) => {
  try {
    const { title, description, date, startTime, location, distance, maxParticipants } = req.body;

    if (!title || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Title, date, and start time are required"
      });
    }

    const run = await Run.create({
      title,
      description,
      date,
      startTime,
      location,
      distance,
      maxParticipants,
      status: "upcoming",
      createdBy: req.user?.id
    });

    return res.status(201).json({
      success: true,
      message: "Run created successfully",
      run
    });
  } catch (error) {
    console.error("Create run error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get all upcoming runs
export const getUpcomingRuns = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const runs = await Run.find({
      status: { $in: ["upcoming", "ongoing"] },
      date: { $gte: startOfToday }
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      runs
    });
  } catch (error) {
    console.error("Get runs error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get all runs the logged-in user has registered for
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await Attendance.find({
      user: userId,
      status: { $in: ["registered", "present"] }
    }).select("run");

    const runIds = registrations
      .filter((item) => item.run)
      .map((item) => item.run.toString());

    return res.status(200).json({
      success: true,
      runIds
    });
  } catch (error) {
    console.error("Get my registrations error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Register user for a run
export const registerForRun = async (req, res) => {
  try {
    const userId = req.user.id;
    const { runId } = req.params;

    if (!mongoose.isValidObjectId(runId)) {
      return invalidRunIdResponse(res);
    }

    // 1. Check if run exists
    const run = await Run.findById(runId);

    if (!run) {
      return res.status(404).json({
        success: false,
        message: "Run not found"
      });
    }

    // 2. Check if run is cancelled
    if (run.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This run has been cancelled"
      });
    }

    // 3. Check if run is already completed
    if (run.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Registration is closed for this run"
      });
    }

    // 4. Check if user is already registered
    const existingRegistration = await Attendance.findOne({
      user: userId,
      run: runId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this run"
      });
    }

    // 5. Check maximum participants
    if (run.maxParticipants) {
      const registeredCount = await Attendance.countDocuments({
        run: runId,
        status: {
          $in: ["registered", "present"]
        }
      });

      if (registeredCount >= run.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: "This run is fully booked"
        });
      }
    }

    // 6. Create registration
    const registration = await Attendance.create({
      user: userId,
      run: runId,
      status: "registered"
    });

    return res.status(201).json({
      success: true,
      message: "Successfully registered for the run",
      registration
    });

  } catch (error) {
    console.error("Run registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Unregister user from a run
export const unregisterForRun = async (req, res) => {
  try {
    const userId = req.user.id;
    const { runId } = req.params;

    if (!mongoose.isValidObjectId(runId)) {
      return invalidRunIdResponse(res);
    }

    const registration = await Attendance.findOneAndDelete({
      user: userId,
      run: runId,
      status: { $in: ["registered", "present"] }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "You are not registered for this run"
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have unregistered successfully"
    });
  } catch (error) {
    console.error("Unregister run error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Public community highlights are based only on completed runs and verified attendance.
export const getCommunityHighlights = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const monthlyRuns = await Run.find({
      status: "completed",
      date: { $gte: monthStart, $lte: now },
    }).select("_id distance").lean();
    const monthlyRunIds = monthlyRuns.map((run) => run._id);
    const monthlyAttendance = monthlyRunIds.length
      ? await Attendance.find({ run: { $in: monthlyRunIds }, status: "present" }).select("user").lean()
      : [];

    const weeklyRuns = await Run.find({
      status: "completed",
      date: { $gte: weekStart, $lte: now },
    }).select("_id").lean();
    const weeklyRunIds = weeklyRuns.map((run) => run._id);
    const weeklyAttendance = weeklyRunIds.length
      ? await Attendance.find({ run: { $in: weeklyRunIds }, status: "present" })
          .populate("user", "name").select("user").lean()
      : [];

    const runnerCounts = new Map();
    for (const record of weeklyAttendance) {
      if (!record.user?._id || !record.user?.name) continue;
      const id = record.user._id.toString();
      const current = runnerCounts.get(id) || { name: record.user.name, checkIns: 0 };
      current.checkIns += 1;
      runnerCounts.set(id, current);
    }
    const weeklySpotlight = [...runnerCounts.values()]
      .sort((a, b) => b.checkIns - a.checkIns || a.name.localeCompare(b.name))[0] || null;
    const uniqueRunners = new Set(monthlyAttendance.map((record) => record.user?.toString()).filter(Boolean));

    return res.status(200).json({
      success: true,
      month: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      monthly: {
        runsHeld: monthlyRuns.length,
        runnerCheckIns: monthlyAttendance.length,
        uniqueRunners: uniqueRunners.size,
        routeKmHosted: monthlyRuns.reduce((total, run) => total + (Number(run.distance) || 0), 0),
      },
      weeklySpotlight,
    });
  } catch (error) {
    console.error("Community highlights error:", error);
    return res.status(500).json({ success: false, message: "Could not load community highlights" });
  }
};
