import Razorpay from "razorpay";
import crypto from "crypto";
import Appointment from "../models/Appointment.js";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// STEP 1: Create order — frontend sends serviceId, patientId, amount, appointmentId
export const createOrder = async (req, res) => {
  try {
    const { amount, serviceId, patientId, appointmentId } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order to DB right away (status: Pending)
    const order = await Order.create({
      razorpayOrderId: razorpayOrder.id,
      service: serviceId,
      patient: patientId,
      appointment: appointmentId, // optional
      amount,
    });

    res.status(201).json({
      orderId: razorpayOrder.id,   // send to frontend for Razorpay checkout
      dbOrderId: order._id,        // save this on frontend too, send back on verify
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// STEP 2: Verify payment and mark order as Paid
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
      appointmentId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(dbOrderId, { status: "Failed" });
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    await Order.findByIdAndUpdate(dbOrderId, {
      status: "Paid",
      razorpayPaymentId: razorpay_payment_id,
    });

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: "Confirmed",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    res.json({ message: "Payment verified successfully", paymentId: razorpay_payment_id });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

// GET all orders (admin) — with service + patient details populated
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("service", "title category charges")
      .populate("patient", "ownerName petName phoneNumber")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};