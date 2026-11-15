const windows = new Map();

const getClientKey = (req) => req.ip || req.socket?.remoteAddress || "unknown";

export const createRateLimiter = ({
  windowMs,
  max,
  message = "Too many requests. Please try again later.",
}) => (req, res, next) => {
  const now = Date.now();
  const key = getClientKey(req);
  const entry = windows.get(key);

  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  entry.count += 1;

  if (entry.count > max) {
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({ success: false, message });
  }

  return next();
};

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many sign-in attempts. Please try again later.",
});

export const verificationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: "Too many verification requests. Please try again later.",
});
