import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Authentication is not configured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "645-run-club",
      audience: "645-run-club-client",
    });
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("role emailVerified");
    if (!user || !user.emailVerified) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = { id: user._id, role: user.role };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default isAuthenticated;
