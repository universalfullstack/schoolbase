import mongoose from "mongoose";
const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Optional: position for sorting sections manually (e.g., Nursery → Primary → Secondary)
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure section names are unique within the same school
sectionSchema.index({ school: 1, name: 1 }, { unique: true });

export default mongoose.model("Section", sectionSchema);
