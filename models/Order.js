import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String }, // filled after payment verified

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    amount: { type: Number, required: true }, // in rupees

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);