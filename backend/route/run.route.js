import express from "express";
import {
  registerForRun,
  getUpcomingRuns,
  createRun,
  getMyRegistrations,
  unregisterForRun,
  getCommunityHighlights,
  getAllRunsForAdmin,
  updateRunByAdmin,
  deleteRunByAdmin,
} from "../controller/runregistration.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createRun);
router.route("/admin/all").get(isAuthenticated, isAdmin, getAllRunsForAdmin);
router.route("/admin/:runId").patch(isAuthenticated, isAdmin, updateRunByAdmin).delete(isAuthenticated, isAdmin, deleteRunByAdmin);
router.route("/upcoming").get(getUpcomingRuns);
router.route("/community-highlights").get(getCommunityHighlights);
router.route("/my-registrations").get(isAuthenticated, getMyRegistrations);
router.route("/:runId/register").post(isAuthenticated, registerForRun);
router.route("/:runId/unregister").delete(isAuthenticated, unregisterForRun);

export default router;
