import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchMembers = (search = "") =>
  api.get(`/members${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const fetchLeaderboard = () => api.get("/members/leaderboard/top");

export const subscribeUser = (payload) => api.post("/subscribe", payload);

export default api;
