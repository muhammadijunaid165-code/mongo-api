import { logger } from "../utils/logger.js";

export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  logger.error("Unhandled error", { error: err?.message, stack: err?.stack });
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
}
