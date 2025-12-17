import mongoose from "mongoose";

const feeReceiptSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeePayment",
      required: true
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("FeeReceipt", feeReceiptSchema);
