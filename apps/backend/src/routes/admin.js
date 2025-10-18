import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import AiMetric from "../models/AiMetric.js";

const router = express.Router();

router.get("/ai-metrics", requireAuth(["admin"]), async (req, res, next) => {
  try {
    const latest = await AiMetric.find().sort({ createdAt: -1 }).limit(200);
    res.json(latest);
  } catch (e) {
    next(e);
  }
});

export default router;
