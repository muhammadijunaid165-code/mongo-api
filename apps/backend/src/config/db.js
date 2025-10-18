import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectDb() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/ai-recruit";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {});
  logger.info("MongoDB connected");
}
