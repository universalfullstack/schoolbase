import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  subdomain: { type: String, required: true, unique: true }, // used for multi-tenancy
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  logo: { type: String },
  status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },

  subjects: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' } ], // A school may have multiple subjects

  // Core academic references
  currentAcademicSession: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicSession" },
  currentTerm: { type: mongoose.Schema.Types.ObjectId, ref: "Term" },

  // New references
  gradingSystem: { type: mongoose.Schema.Types.ObjectId, ref: "GradingSystem" },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },

  // Soft delete
  deletedAt: { type: Date, default: null }

}, { timestamps: true });

export default mongoose.model("School", SchoolSchema);
