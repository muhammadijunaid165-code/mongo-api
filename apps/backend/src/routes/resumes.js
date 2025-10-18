import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { requireAuth } from "../middlewares/auth.js";
import Resume from "../models/Resume.js";
import axios from "axios";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload", requireAuth(["candidate"]), upload.single("file"), async (req, res, next) => {
  try {
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.v2.uploader.upload(file, { resource_type: "raw" });

    const resume = await Resume.create({ userId: req.user.sub, fileUrl: result.secure_url });

    const aiUrl = `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/parse_resume`;
    const parseResp = await axios.post(aiUrl, { url: result.secure_url });

    resume.text = parseResp.data.text || "";
    resume.parsed = parseResp.data.parsed || {};
    await resume.save();

    res.json(resume);
  } catch (e) {
    next(e);
  }
});

router.get("/me", requireAuth(["candidate"]), async (req, res, next) => {
  try {
    const r = await Resume.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(r);
  } catch (e) {
    next(e);
  }
});

export default router;
