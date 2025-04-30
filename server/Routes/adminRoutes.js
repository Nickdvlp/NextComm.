import express from "express";
import { admin, protect } from "../Middlewares/authMiddleware.js";
import User from "../Models/userSchema.js";

const router = express.Router();

// @route GET /api/admin/users
// @desc get all users (Admin Only)
// @access private/admin

router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// @route POST /api/admin/add-users
// @desc add a new user (Admin Only)
// @access private/admin

router.post("/add-user", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists." });
    }
    user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// @route PUT /api/admin/user/:id
// @desc update the user info (admin only)
// @access private/admin

router.put("/user/:id", protect, admin, async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;
  try {
    let user = await User.findById(id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
    }
    const updatedUser = await user.save();

    res.status(200).json({ Updated_User: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// @route DELETE /api/admin/user/:id
// @desc delete the user (admin only)
// @access private/admin

router.delete("/user/:id", protect, admin, async (req, res) => {
  const { id } = req.params;
  try {
    let user = await User.findById(id);
    if (user) {
      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res.status(494).json({ message: "User not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
