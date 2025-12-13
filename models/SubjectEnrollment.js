import mongoose from "mongoose";

const { Schema } = mongoose;

const SubjectEnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    section: { type: Schema.Types.ObjectId, ref: "Section", required: true }, // NEW
    academicSession: { type: Schema.Types.ObjectId, ref: "AcademicSession", required: true },
    term: { type: Schema.Types.ObjectId, ref: "Term" },
    classLevel: { type: Schema.Types.ObjectId, ref: "ClassLevel", required: true },
    classArm: { type: Schema.Types.ObjectId, ref: "ClassArm" },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    enrollmentStatus: { type: String, enum: ["enrolled", "dropped", "completed"], default: "enrolled" },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

// Prevent duplicate subject enrollment per student + school + section + session + class level + arm + subject
SubjectEnrollmentSchema.index(
  { student: 1, school: 1, section: 1, academicSession: 1, term: 1, classLevel: 1, classArm: 1, subject: 1 },
  { unique: true }
);

export default mongoose.model("SubjectEnrollment", SubjectEnrollmentSchema);
