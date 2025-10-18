import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://junaid:junaid123@cluster0.2jzrptw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Error:", err));

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
});
const Post = mongoose.model("Post", PostSchema);

app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json({ message: "Post added!", post: newPost });
});

app.listen(5000, () => console.log("Server running on port 5000"));
