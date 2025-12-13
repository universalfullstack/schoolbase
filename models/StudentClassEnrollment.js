import mongoose from "mongoose";

const { Schema } = mongoose;

const StudentClassEnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    section: { type: Schema.Types.ObjectId, ref: "Section", required: true }, // NEW
    academicSession: { type: Schema.Types.ObjectId, ref: "AcademicSession", required: true },
    term: { type: Schema.Types.ObjectId, ref: "Term" },
    classLevel: { type: Schema.Types.ObjectId, ref: "ClassLevel", required: true },
    classArm: { type: Schema.Types.ObjectId, ref: "ClassArm" },
    status: {
      type: String,
      enum: ["enrolled", "promoted", "repeated", "graduated", "withdrawn", "transferred"],
      default: "enrolled"
    },
    promotionToClassLevel: { type: Schema.Types.ObjectId, ref: "ClassLevel", default: null },
    enrolledAt: { type: Date, default: Date.now },
    recordedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

// Unique enrollment per student + school + section + session + class level + arm
StudentClassEnrollmentSchema.index(
  { student: 1, school: 1, section: 1, academicSession: 1, classLevel: 1, classArm: 1 },
  { unique: true }
);

export default mongoose.model("StudentClassEnrollment", StudentClassEnrollmentSchema);
