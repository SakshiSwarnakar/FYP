import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB...`);
    console.log(ENV.MONGO_URI)
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      dbName: ENV.DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
