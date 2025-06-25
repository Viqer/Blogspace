require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Use id instead of _id for JWT payload
    const getTokenData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = getTokenData.id || getTokenData._id;
    if (!userId) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = isUserExist;

    next();

  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  authenticateToken
}