import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeInvoice",
      required: true
    },
    amountPaid: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "transfer", "card"],
      required: true
    },
    status: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid"
    }
  },
  { timestamps: true }
);

export default mongoose.model("FeePayment", feePaymentSchema);
