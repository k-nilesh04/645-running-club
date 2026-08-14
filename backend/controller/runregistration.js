import Run from "../models/run.model.js";
import Attendance from "../models/attendance.model.js";

// Register user for a run
export const registerForRun = async (req, res) => {
  try {
    const userId = req.user.id;
    const { runId } = req.params;

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