import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns"; 
import connectDB from "./config/db.js";
import Blog from "./models/Blog.js";
import blogsData from "./data/blogsData.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

dns.setServers(["1.1.1.1" , "0.0.0.0"]);
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedBlogs = async () => {
  try {
    await Blog.deleteMany();

    for (const blog of blogsData) {
      const imagePath = path.join(
        __dirname,
        "assets/gallery",
        blog.image
      );

     const result = await cloudinary.uploader.upload(imagePath, {
  folder: "blogs",
  transformation: [
    { width: 1200, crop: "limit" },
    { quality: "auto" }
  ]
});
      await Blog.create({
        title: blog.title,
        content: blog.content,
        imageUrl: result.secure_url,
      });
    }

    console.log("Blogs seeded with Cloudinary images 🌱");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedBlogs();