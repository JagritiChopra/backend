import express from "express";
import {
  createService,
  getServices,
  getSingleService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";


const router = express.Router();

// Public (for app)
router.get("/", getServices);
router.get("/:id", getSingleService);

// Admin only

router.post("/", adminAuth, upload.single("image"), createService);
router.put("/:id", adminAuth, updateService);
router.delete("/:id", adminAuth, deleteService);

export default router;