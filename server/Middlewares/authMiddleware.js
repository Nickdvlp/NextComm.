import jwt from "jsonwebtoken";
import User from "../Models/userSchema.js";

// Middleware to protect Routes

export const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select("-password");

      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token provided" });
    }
  } catch (err) {
    console.log("Token Verify", err.message);
    res.status(401).json({ message: "Not Authorized, token failed" });
  }
};

//Middleware for admin Routes
export const admin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(400).json({ message: "Not Authorized." });
  }
};
