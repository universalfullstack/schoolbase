// models/GradingSystem.js
import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  grade: { type: String, required: true }, // e.g., A, B, C
  minScore: { type: Number, required: true }, // minimum score for this grade
  maxScore: { type: Number, required: true }, // maximum score for this grade
  point: { type: Number, required: true }, // GPA points, e.g., 4.0, 3.5
  remark: { type: String, trim: true }, // optional remark
});

const GradingSystemSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true, // e.g., "Primary School Grading", "High School Grading"
      trim: true,
    },
    description: { type: String, trim: true }, // optional description
    grades: [GradeSchema], // array of grade ranges
    isDefault: { type: Boolean, default: false }, // for schools with multiple grading systems
  },
  { timestamps: true }
);

// Ensure a school cannot have duplicate grading system names
GradingSystemSchema.index({ school: 1, name: 1 }, { unique: true });

export default mongoose.model("GradingSystem", GradingSystemSchema);
