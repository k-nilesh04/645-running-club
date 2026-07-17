import mongoose from "mongoose";
import Member from "../models/Member.js";

const requireDatabase = (res) => {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ message: "Database is not connected. Set MONGO_URI and restart the server." });
  return false;
};

// @desc  Get all members (supports ?search=)
// @route GET /api/members
export const getMembers = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const { search } = req.query;
    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    const members = await Member.find(filter).sort({ distanceKm: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single member
// @route GET /api/members/:id
export const getMemberById = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a member
// @route POST /api/members
export const createMember = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update a member
// @route PUT /api/members/:id
export const updateMember = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete a member
// @route DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Leaderboard - top runners by distance
// @route GET /api/members/leaderboard/top
export const getLeaderboard = async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const topRunners = await Member.find().sort({ distanceKm: -1 }).limit(10);
    res.json(topRunners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
