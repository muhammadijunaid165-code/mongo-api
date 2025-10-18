import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    score: Number,
    timeTakenSec: Number,
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    questions: [{ type: String }],
    qa: [qaSchema],
    feedback: { type: String },
    securityFlags: {
      devtoolsOpened: { type: Boolean, default: false },
      tabBlurredCount: { type: Number, default: 0 },
      copyEvents: { type: Number, default: 0 },
      screenshotAttempts: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
