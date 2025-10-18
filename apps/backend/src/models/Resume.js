import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    text: { type: String },
    parsed: {
      skills: [{ type: String }],
      education: [{ type: String }],
      experience: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
