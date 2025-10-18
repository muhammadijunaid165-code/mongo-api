import express from "express";
import Job from "../models/Job.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", requireAuth(["recruiter", "admin"]), async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiterId: req.user.sub });
    res.json(job);
  } catch (e) {
    next(e);
  }
});

router.get("/", requireAuth(["recruiter", "admin", "candidate"]), async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireAuth(["recruiter", "admin"]), async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth(["recruiter", "admin"]), async (req, res, next) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
});

export default router;
