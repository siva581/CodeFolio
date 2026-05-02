import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    templateId: {
      type: String,
      enum: ["minimalist", "corporate", "creative", "dark", "designer", "startup", "professional", "artistic", "cyberpunk", "material"],
      default: "minimalist",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
