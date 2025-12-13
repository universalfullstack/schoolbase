import mongoose from "mongoose";

const ClassArmSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true, index: true }, // NEW
    classLevel: { type: mongoose.Schema.Types.ObjectId, ref: "ClassLevel", required: true },
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, default: null },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null }
  },
  { timestamps: true }
);

// Unique arm name per school + section + class level
ClassArmSchema.index({ school: 1, section: 1, classLevel: 1, name: 1 }, { unique: true });

export default mongoose.model("ClassArm", ClassArmSchema);
