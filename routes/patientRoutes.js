import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

// ➕ Create
router.post("/", createPatient);

// 📄 Get all
router.get("/", getPatients);

// 🔍 Get single
router.get("/:id", getPatientById);

// ✏️ Update
router.put("/:id", updatePatient);

// ❌ Delete
router.delete("/:id", deletePatient);

export default router;