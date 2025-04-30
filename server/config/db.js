import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected successfully");
  } catch (err) {
    console.log("mongodb connection failed");
    process.exit(1);
  }
};

export default connectDb;
