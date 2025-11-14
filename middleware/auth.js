const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret_lumepath";

module.exports = function (req, res, next) {
  const token = req.cookies?.token; // cookies handled by express
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // server/middleware/auth.js
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.user = { _id: decoded.userId };
    next();

  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

