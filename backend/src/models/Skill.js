import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "devops", "tools"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Skill = mongoose.model("Skill", skillSchema);
