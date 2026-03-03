import Blog from "../models/Blog.js";

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { imageUrl, title, content } = req.body;

    const blog = await Blog.create({
      imageUrl,
      title,
      content,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Single Blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};