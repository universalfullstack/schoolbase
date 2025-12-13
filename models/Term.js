import mongoose from "mongoose";

const TermSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  order: {
    type: Number,
    required: true // 1, 2, 3
  },

  isCurrent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

TermSchema.index({ name: 1, school: 1 }, { unique: true });

export default mongoose.model("Term", TermSchema);
