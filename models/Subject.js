import mongoose from "mongoose";

const { Schema } = mongoose;

const SubjectSchema = new Schema(
  {


    name: {
      type: String,
      required: true
      unique: true,
      trim: true
    },

    code: {
      type: String,
      trim: true,
      sparse: true,
      default: null // optional unique subject code like "ENG101"
    },

    description: {
      type: String,
      trim: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
