import mongoose from "mongoose";

const { Schema } = mongoose;

const SubjectSchema = new Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true
    },

    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: false, // some subjects may be universal
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      trim: true,
      default: null // optional unique subject code like "ENG101"
    },

    description: {
      type: String,
      trim: true
    },

    isCore: {
      type: Boolean,
      default: true // core vs elective
    },

    assignedTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      default: null
    },

    order: {
      type: Number,
      default: 0 // optional, for display sorting
    }
  },
  { timestamps: true }
);

// Ensure unique subject name per school (and section if used)
SubjectSchema.index(
  { school: 1, section: 1, name: 1 },
  { unique: true }
);

// Optional: unique code per school
SubjectSchema.index(
  { school: 1, code: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model("Subject", SubjectSchema);
