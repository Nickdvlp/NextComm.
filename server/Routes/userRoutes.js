import express from "express";
import User from "../Models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(401).json({ message: "All Fields are required" });
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist)
      return res.status(500).json({ message: "user already exists." });

    if (password.length < 8 || password.length > 16) {
      return res
        .status(400)
        .json({ message: "Password must be 8 characters long." });
    }

    const user = new User({ name: name, email: email, password: password });
    await user.save();

    // JWT Create
    const payload = { user: { id: user._id, role: user.role } };

    await jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
      (err, token) => {
        if (err) throw err;

        return res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Check Your credentials" });
  }
});

// login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Password is invalid" });

    const payload = { user: { id: user._id, role: user.role } };

    await jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
      (err, token) => {
        if (err) throw err;

        return res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Get Profile Route
router.get("/profile", protect, async (req, res) => {
  res.status(200).json(req.user);
});

export default router;
