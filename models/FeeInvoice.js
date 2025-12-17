import mongoose from "mongoose";

const feeInvoiceSchema = new mongoose.Schema(
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
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid"
    },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("FeeInvoice", feeInvoiceSchema);
