import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import memberRoutes from "./routes/members.js";
import subscribeRoutes from "./routes/subscribe.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

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
