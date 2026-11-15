import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRoutes from "./route/user.route.js";
import verificationRoutes from "./route/verificationRoutes.js";
import runRoutes from "./route/run.route.js";
import paymentRoutes from "./route/payment.route.js";
import adminRoutes from "./route/admin.route.js";
import chatbotRoutes from "./route/chatbot.route.js";
import csrfProtection from "./middlewares/csrfProtection.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0) {
  throw new Error("TRUST_PROXY_HOPS must be a non-negative integer");
}
app.set("trust proxy", trustProxyHops);
app.disable("x-powered-by");

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://645-running-club.vercel.app",
  ...String(process.env.FRONTEND_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean),
]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    const error = new Error("Origin is not allowed");
    error.status = 403;
    return callback(error);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 600,
};

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(cookieParser());
app.use(csrfProtection);

app.use("/api/user", userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatbotRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message || error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }
  return res.status(error.status || 500).json({
    success: false,
    message: error.status && error.status < 500 ? "Invalid request." : "Server error",
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(port, "0.0.0.0", () => console.log(`Server is running on port ${port}`));
};

startServer();
