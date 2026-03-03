import express from "express";
import {
  createImage,
  getImages,
  updateImage,
  deleteImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// ➕ Create
router.post("/", createImage);

// 📄 Get all
router.get("/", getImages);

// ✏️ Update
router.put("/:id", updateImage);

// ❌ Delete
router.delete("/:id", deleteImage);

export default router;