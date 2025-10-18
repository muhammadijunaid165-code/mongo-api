import dotenv from "dotenv";

export function loadEnv() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    dotenv.config();
  }
}
