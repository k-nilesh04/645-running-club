import express from "express";
import { registerForRun } from "../controller/runregistration.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/:runId/register").post(isAuthenticated, registerForRun);

export default router;
