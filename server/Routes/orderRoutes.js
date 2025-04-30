import express from "express";
import { protect } from "../Middlewares/authMiddleware.js";
import Order from "../Models/orderSchema.js";

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
//@access private

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// @route GET /api/orders/:id
// @desc Get order details by Id
//@access private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      res.status(404).json({ message: "Order Not Found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
