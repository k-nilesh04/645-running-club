import axios from "axios";
import dotenv from "dotenv";

dotenv.config({});


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const signupUser = (payload) => api.post("/user/signup", payload);

export const loginUser = (payload) => api.post("/user/login", payload);

export const logoutUser = () => api.post("/user/logout");

export const getMyProfile = () => api.get("/user/profile");

export const updateMyProfile = (payload) => api.put("/user/profile/update", payload);

export const sendVerificationOtp = (email) =>
  api.post("/verification/send-otp", { email });

export const verifyEmailOtp = (payload) =>
  api.post("/verification/verify-otp", payload);

export const getUpcomingRuns = () => api.get("/runs/upcoming");

export const registerForRun = (runId) => api.post(`/runs/${runId}/register`);

export const initiatePayment = (payload) => api.post("/payment/initiate", payload);

export const verifyPayment = (payload) => api.post("/payment/verify", payload);

export const getMembershipStatus = () => api.get("/payment/status");

export const cancelMembership = () => api.post("/payment/cancel");

export default api;
