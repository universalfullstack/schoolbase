import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    classLevel: { type: String },
    term: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);
