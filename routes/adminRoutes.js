import express from "express";
import { loginAdmin , registerAdmin , forgotPassword,  resetPassword       } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);


router.post("/forgot-password", forgotPassword);          
router.post("/reset-password/:token", resetPassword); 

router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;