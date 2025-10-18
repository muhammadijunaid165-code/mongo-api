import mongoose from "mongoose";

const aiMetricSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true },
    latencyMs: { type: Number, required: true },
    success: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("AiMetric", aiMetricSchema);
