import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Basic", "Pro", "Enterprise"
    description: { type: String },

    // Pricing
    price: { type: Number, required: true }, // in your preferred currency (e.g., NGN)
    discount: { type: Number, default: 0 }, // No discount by default
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    // Resource limits
    maxStudents: { type: Number, default: 0 }, // 0 = unlimited
    maxStaff: { type: Number, default: 0 },
    maxClasses: { type: Number, default: 0 },
    maxSections: { type: Number, default: 0 },

    // Additional features
    features: [{ type: String }], // e.g., ["Messaging", "Reports", "Custom Branding"]

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
