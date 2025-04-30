import express from "express";
import Cart from "../Models/cartSchema.js";
import Product from "../Models/ProductSchema.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { getCart } from "../helper/getCart.js";

const router = express.Router();

// post products to the cart
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product Not Found." });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      const updatedTotal = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const updatedCart = await Cart.findByIdAndUpdate(
        cart._id,
        {
          products: cart.products,
          totalPrice: updatedTotal,
        },
        { new: true }
      );

      return res.status(200).json(updatedCart);
    } else {
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged in user
// @access Public
// router.put("/", async (req, res) => {
//   const { productId, quantity, size, color, guestId, userId } = req.body;

//   try {
//     let cart = await getCart(userId, guestId);
//     if (!cart) return res.status(404).json({ message: "Cart not found." });
//     const productIndex = cart.products.findIndex(
//       (p) =>
//         p.productId.toString() === productId &&
//         p.size === size &&
//         p.color === color
//     );

//     if (productIndex > -1) {
//       if (quantity > 0) {
//         cart.products[productIndex].quantity = quantity;
//       } else {
//         cart.products.splice(productIndex, 1);
//       }

//       cart.totalPrice = cart.products.reduce(
//         (acc, item) => acc + item.price * item.quantity,
//         0
//       );
//       await cart.save();
//       return res.status(200).json(cart);
//     } else {
//       return res.status(404).json({ message: "Product not found in cart." });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server Error" });
//   }
// });

//@route DELETE /api/cart
// @desc remove a product from cart
// Access public
// router.delete("/", async (req, res) => {
//   const { productId, size, color, guestId, userId } = req.body;

//   try {
//     let cart = await getCart(userId, guestId);
//     if (!cart) {
//       res.status(404).json({ message: "Cart Not Found." });
//     }
//     const productIndex = cart.products.findIndex(
//       (p) =>
//         p.productId.toString() === productId &&
//         p.size === size &&
//         p.color === color
//     );
//     if (productIndex > -1) {
//       cart.products.splice(productIndex, 1);
//       cart.totalPrice = cart.products.reduce(
//         (acc, item) => acc + item.price * item.quantity,
//         0
//       );
//       await cart.save();
//       return res.status(200).json(cart);
//     } else {
//       return res.status(404).json({ message: "Product Not Found in Cart." });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(501).json({ message: "Server Error." });
//   }
// });

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      const updatedTotal = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const updatedCart = await Cart.findByIdAndUpdate(
        cart._id,
        {
          products: cart.products,
          totalPrice: updatedTotal,
        },
        { new: true }
      );

      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: "Product not found in cart." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// DELETE: Remove product from cart
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart Not Found." });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      const updatedTotal = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const updatedCart = await Cart.findByIdAndUpdate(
        cart._id,
        {
          products: cart.products,
          totalPrice: updatedTotal,
        },
        { new: true }
      );

      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: "Product Not Found in Cart." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error." });
  }
});

//@route GET /api/cart
// @desc get the logged in user's and guest's cart
// Access public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error." });
  }
});

//@route POST /api/cart/merge
// @desc merge guest cart into user cart on login
// Access private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        res.status(404).json({ message: "Guest Cart is Empty." });
      }

      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();

        // after create userCart delete the guestCart

        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting guest Cart" });
        }

        res.status(200).json(userCart);
      } else {
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest Cart Not Found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error." });
  }
});
export default router;
