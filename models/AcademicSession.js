import mongoose from "mongoose";

const AcademicSessionSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true // Example: "2024/2025"
    },

    startDate: {
      type: Date,
      default: null
    },

    endDate: {
      type: Date,
      default: null
    },

    isCurrent: {
      type: Boolean,
      default: false
    },

    // Optional: keeps track of lifecycle
    status: {
      type: String,
      enum: ["Upcoming", "Active", "Completed"],
      default: "Upcoming"
    },

    // Optional: for end-of-session promotions
    autoPromoteEnabled: {
      type: Boolean,
      default: false
    },

    slug: {
      type: String,
      sparse: true
    }
  },
  { timestamps: true }
);

// Generate slug like "2024-2025"
AcademicSessionSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = this.name.replace(/\//g, "-");
  }
  next();
});

// Ensure ONLY ONE "isCurrent" session per school
AcademicSessionSchema.pre("save", async function (next) {
  if (this.isCurrent) {
    await this.constructor.updateMany(
      { school: this.school, _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
  next();
});

// Unique session name within a school
AcademicSessionSchema.index({ school: 1, name: 1 }, { unique: true });

export default mongoose.model("AcademicSession", AcademicSessionSchema);
