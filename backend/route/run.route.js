import express from "express";
import { registerForRun, getUpcomingRuns, createRun } from "../controller/runregistration.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/create").post(createRun);
router.route("/upcoming").get(getUpcomingRuns);
router.route("/:runId/register").post(isAuthenticated, registerForRun);

export default router;
