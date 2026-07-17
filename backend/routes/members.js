import express from "express";
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getLeaderboard,
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/leaderboard/top", getLeaderboard);
router.route("/").get(getMembers).post(createMember);
router
  .route("/:id")
  .get(getMemberById)
  .put(updateMember)
  .delete(deleteMember);

export default router;
