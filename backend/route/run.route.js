import express from "express";
import {
  registerForRun,
  getUpcomingRuns,
  createRun,
  getMyRegistrations,
  unregisterForRun,
  getCommunityHighlights,
} from "../controller/runregistration.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, isAdmin, createRun);
router.route("/upcoming").get(getUpcomingRuns);
router.route("/community-highlights").get(getCommunityHighlights);
router.route("/my-registrations").get(isAuthenticated, getMyRegistrations);
router.route("/:runId/register").post(isAuthenticated, registerForRun);
router.route("/:runId/unregister").delete(isAuthenticated, unregisterForRun);

export default router;
