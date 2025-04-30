import dotenv from "dotenv";
import Product from "./Models/ProductSchema.js";
import products from "./data/products.js";
import connectDb from "./config/db.js";
// import User from "./Models/userSchema.js";
import Cart from "./Models/cartSchema.js";

dotenv.config({ path: "./config.env" });

const seedData = async () => {
  await connectDb();

  try {
    await Product.deleteMany();
    await Cart.deleteMany();
    const createdProduct = products.map((product) => ({
      ...product,
      user: "67fa38eb608b12e23bd24318",
    }));
    await Product.insertMany(createdProduct);
    console.log("product seeded successfully.");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
    // res.status(501).json(err, { message: "Server Error." });
  }
};

seedData();
