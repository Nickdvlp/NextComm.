import express from "express";
import { admin, protect } from "../Middlewares/authMiddleware.js";
import Product from "../Models/ProductSchema.js";

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products
// @access private

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
