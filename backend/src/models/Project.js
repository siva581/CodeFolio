import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    tech_stack: {
      type: [String],
      default: [],
    },
    repo_url: {
      type: String,
      default: null,
    },
    live_url: {
      type: String,
      default: null,
    },
    screenshot_url: {
      type: String,
      default: null,
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

export const Project = mongoose.model("Project", projectSchema);
