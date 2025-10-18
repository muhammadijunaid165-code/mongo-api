import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import axios from "axios";

const router = express.Router();

router.post("/apply", requireAuth(["candidate"]), async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const resume = await Resume.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
    const job = await Job.findById(jobId);
    if (!resume || !job) return res.status(400).json({ message: "Missing resume or job" });

    const aiUrl = `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/match_score`;
    const { data } = await axios.post(aiUrl, {
      resume_text: resume.text,
      job_description: job.description,
    });

    const appDoc = await Application.create({
      userId: req.user.sub,
      jobId,
      matchScore: data.score || 0,
    });
    res.json(appDoc);
  } catch (e) {
    next(e);
  }
});

router.get("/job/:jobId", requireAuth(["recruiter", "admin"]), async (req, res, next) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId }).populate("userId");
    res.json(apps);
  } catch (e) {
    next(e);
  }
});

router.put("/:id/status", requireAuth(["recruiter", "admin"]), async (req, res, next) => {
  try {
    const doc = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

export default router;
