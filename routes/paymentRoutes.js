import express from "express";
import { createOrder, verifyPayment, getOrders } from "../controllers/paymentController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create-order", createOrder);   // public — user calls this
router.post("/verify", verifyPayment);        // public — user calls after paying
router.get("/orders", adminAuth, getOrders);  // protected — admin only

export default router;