import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import memberRoutes from "./routes/members.js";
import subscribeRoutes from "./routes/subscribe.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// inbuilt middleware to parse incoming JSON requests
app.use(express.json());

const loginMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== process.env.API_KEY) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

app.use(loginMiddleware);

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== process.env.API_KEY) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};  

const validationMiddleware = (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email, and phone are required" });
  }
  next();
};

app.get("/", (req, res) => {
  res.json({ message: "645 Dwarka Chapter Running Club API is running" });
});

app.use("/api/members", memberRoutes);
app.use("/api/subscribe", subscribeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
