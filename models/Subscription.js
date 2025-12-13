import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    // Payment details
    paymentMethod: { type: String }, // e.g., "card", "manual", "paypal"
    amountPaid: { type: Number, required: true },
    currency: { type: String, default: "NGN" },

    // Subscription period
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: false },

    // Status
    status: {
      type: String,
      enum: ["active", "expired", "pending", "cancelled"],
      default: "pending",
    },

    // Optional notes
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);
