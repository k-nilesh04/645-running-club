const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const csrfProtection = (req, res, next) => {
  if (safeMethods.has(req.method)) return next();

  if (req.get("X-Requested-With") !== "XMLHttpRequest") {
    return res.status(403).json({ success: false, message: "Invalid request origin" });
  }

  return next();
};

export default csrfProtection;
