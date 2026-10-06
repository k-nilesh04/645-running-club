const requests = new Map();
let lastCleanup = Date.now();

const windowMs = () => Math.max(1000, Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || 60_000);
const maxRequests = () => Math.max(1, Number(process.env.CHAT_RATE_LIMIT_MAX) || 20);

const chatbotRateLimiter = (req, res, next) => {
  const now = Date.now();
  const duration = windowMs();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const record = requests.get(key);

  if (!record || now - record.startedAt >= duration) {
    requests.set(key, { startedAt: now, count: 1 });
  } else if (record.count >= maxRequests()) {
    return res.status(429).json({
      success: false,
      message: "You've sent too many requests. Please wait a moment and try again.",
    });
  } else {
    record.count += 1;
  }

  if (requests.size > 1000 && now - lastCleanup > duration) {
    for (const [ip, value] of requests) {
      if (now - value.startedAt >= duration) requests.delete(ip);
    }
    lastCleanup = now;
  }

  return next();
};

export default chatbotRateLimiter;
