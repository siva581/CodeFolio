import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 32,
      match: /^[a-z0-9_-]+$/,
    },
    full_name: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    avatar_url: {
      type: String,
      default: null,
    },
    resume_url: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    email_public: {
      type: String,
      default: null,
    },
    github_url: {
      type: String,
      default: null,
    },
    linkedin_url: {
      type: String,
      default: null,
    },
    twitter_url: {
      type: String,
      default: null,
    },
    website_url: {
      type: String,
      default: null,
    },
    custom_domain: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
      index: true,
    },
    custom_domain_verified: {
      type: Boolean,
      default: false,
    },
    domain_verification_token: {
      type: String,
      default: null,
    },
    template_id: {
      type: String,
      enum: [
        "minimalist",
        "corporate",
        "creative",
        "dark",
        "designer",
        "startup",
        "professional",
        "artistic",
        "cyberpunk",
        "material",
      ],
      default: "minimalist",
    },
    is_pro: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Profile = mongoose.model("Profile", profileSchema);
