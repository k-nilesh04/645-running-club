import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export const createToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      issuer: "645-run-club",
      audience: "645-run-club-client",
    },
  );
};

export const setAuthCookie = (res, token) =>
  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
