import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// POST - Create Blog
router.post("/", createBlog);

// GET - All Blogs
router.get("/", getBlogs);

// GET - Single Blog
router.get("/:id", getBlogById);

// DELETE - Delete Blog
router.delete("/:id", deleteBlog);

export default router;