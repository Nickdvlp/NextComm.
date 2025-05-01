import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import UserRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import checkoutRoutes from "./Routes/checkoutRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import subsRoutes from "./Routes/subsRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import productAdminRoutes from "./Routes/productAdminRoutes.js";
import orderAdminRoutes from "./Routes/orderAdminRoutes.js";

// Setup
const app = express();

const frontendUrl = "https://next-comm-frontend.vercel.app/";
dotenv.config({ path: "./config.env" });
connectDb();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://next-comm-frontend.vercel.app/"
  );

  next();
});
app.use(
  cors({
    origin: frontendUrl, // Allow requests only from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary HTTP methods
    credentials: true, // If you're using cookies or authentication tokens
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to nextComm. Api!");
});
app.use("/api/users", UserRoutes);
app.use("api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

// ✅ Export app as a handler for Vercel
export default app;
