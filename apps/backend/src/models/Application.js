import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" },
    matchScore: { type: Number, default: 0 },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
