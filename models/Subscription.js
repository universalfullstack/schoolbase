import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },

    // Payment details
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "manual"],
      required: true,
      default: "manual",
    },
    paymentReference: { type: String }, // transaction ID from gateway
    payerEmail: { type: String }, // optional, mostly for PayPal
    currency: { type: String, default: "NGN" },
    amountPaid: { type: Number }, // populated from Plan

    // Subscription period
    startDate: { type: Date, required: true, default: Date.now },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    autoRenew: { type: Boolean, default: false },

    // Status
    status: {
      type: String,
      enum: ["active", "expired", "pending", "cancelled"],
      default: "pending",
    },

    // Optional notes
    notes: { type: String },

    // History of status changes
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["active", "expired", "pending", "cancelled"],
        },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Virtual to check if subscription is expired
SubscriptionSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

// Pre-save hook to populate amountPaid from Plan if not set
SubscriptionSchema.pre("save", async function () {
  if (!this.amountPaid) {
    const Plan = mongoose.model("Plan");
    const plan = await Plan.findById(this.plan);
    if (plan) this.amountPaid = plan.price;
  }

  // Auto-expire logic
  if (this.endDate < new Date() && this.status === "active") {
    this.status = "expired";
    this.statusHistory.push({ status: "expired" });
  }
});

export default mongoose.model("Subscription", SubscriptionSchema);
