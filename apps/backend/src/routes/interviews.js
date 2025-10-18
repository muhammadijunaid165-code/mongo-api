import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import Interview from "../models/Interview.js";
import axios from "axios";

const router = express.Router();

router.post("/start", requireAuth(["candidate"]), async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const aiUrl = `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/generate_questions`;
    const { data } = await axios.post(aiUrl, { job_id: jobId, count: 5 });
    const interview = await Interview.create({ userId: req.user.sub, jobId, questions: data.questions });
    res.json({ interviewId: interview._id, questions: interview.questions });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/submit", requireAuth(["candidate"]), async (req, res, next) => {
  try {
    const { answers } = req.body; // [{question, answer, timeTakenSec}]
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Not found" });

    const aiUrl = `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/evaluate_answers`;
    const { data } = await axios.post(aiUrl, { qa: answers });

    interview.qa = answers.map((a, i) => ({ ...a, score: data.scores?.[i] || 0 }));

    const feedUrl = `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/feedback_summary`;
    const feed = await axios.post(feedUrl, { qa: interview.qa });
    interview.feedback = feed.data.summary || "";

    await interview.save();

    res.json(interview);
  } catch (e) {
    next(e);
  }
});

export default router;
