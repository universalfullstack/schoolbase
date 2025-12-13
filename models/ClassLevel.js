import mongoose from "mongoose";

const ClassLevelSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true, index: true },
    name: { type: String, required: true, trim: true },
    alias: { type: String, trim: true, default: null },
    order: { type: Number, required: true },
    slug: { type: String, index: true },
  },
  { timestamps: true }
);

ClassLevelSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

// Unique per school + section
ClassLevelSchema.index({ school: 1, section: 1, name: 1 }, { unique: true });

export default mongoose.model("ClassLevel", ClassLevelSchema);
