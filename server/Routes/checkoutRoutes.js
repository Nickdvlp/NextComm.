import express from "express";
import { protect } from "../Middlewares/authMiddleware.js";
import Checkout from "../Models/checkoutSchema.js";
import Order from "../Models/orderSchema.js";
import Cart from "../Models/cartSchema.js";

const router = express.Router();

//@route POST /api/checkout
// @desc Create a new checkout session
// @access private

router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    res.status(404).json({ message: "No items in checkout section." });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      orderItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    console.log(newCheckout);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to create checkout" });
  }
});

//@route PUT /api/checkout/:id/pay
//@desc  update checkout to mark paid after successful payment
//@access private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      res.status(404).json({ message: "Checkout not found." });
    }

    if (paymentStatus === "paid") {
      (checkout.isPaid = true), (checkout.paymentStatus = paymentStatus);
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid payment status." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

//@route POST /api/checkout/:id/finalize
//@desc  finalize checkout and convert to an order after payment confirmation
//@access private

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      res.status(404).json({ message: "Checkout not found." });
    }
    console.log("checkout", checkout);
    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.orderItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      console.log(checkout);
      await checkout.save();

      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized." });
    } else {
      res.status(400).json({ message: "Checkout is not paid." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

export default router;
