import { Profile } from "../models/Profile.js";
import { Project } from "../models/Project.js";
import { Skill } from "../models/Skill.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { User } from "../models/User.js";
import { generateUniqueUsername } from "../utils/username.js";

const toProfileDto = (profile) => ({
  id: profile.userId,
  username: profile.username,
  full_name: profile.full_name,
  title: profile.title,
  bio: profile.bio,
  avatar_url: profile.avatar_url,
  resume_url: profile.resume_url,
  location: profile.location,
  email_public: profile.email_public,
  github_url: profile.github_url,
  linkedin_url: profile.linkedin_url,
  twitter_url: profile.twitter_url,
  website_url: profile.website_url,
  custom_domain: profile.custom_domain,
  custom_domain_verified: Boolean(profile.custom_domain_verified),
  template_id: profile.template_id,
  is_pro: profile.is_pro,
});

const toUserDto = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  templateId: user.templateId,
});

const normalizeIdentifier = (value) => String(value || "").trim().toLowerCase();

const findProfileByIdentifier = async (identifier) => {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) return null;

  return Profile.findOne({
    $or: [{ username: normalized }, { custom_domain: normalized }],
  });
};

const toProjectDto = (project) => ({
  id: project._id.toString(),
  user_id: project.userId,
  title: project.title,
  description: project.description,
  tech_stack: project.tech_stack,
  repo_url: project.repo_url,
  live_url: project.live_url,
  screenshot_url: project.screenshot_url,
  position: project.position,
});

const toSkillDto = (skill) => ({
  id: skill._id.toString(),
  user_id: skill.userId,
  category: skill.category,
  name: skill.name,
  position: skill.position,
});

const buildPortfolioPayload = async (userId) => {
  const [user, profile, projects, skills] = await Promise.all([
    User.findById(userId).select("_id name email templateId"),
    Profile.findOne({ userId }),
    Project.find({ userId }).sort({ position: 1, createdAt: 1 }),
    Skill.find({ userId }).sort({ position: 1, createdAt: 1 }),
  ]);

  if (!user || !profile) {
    return null;
  }

  const profileDto = toProfileDto(profile);
  
  if (String(profile.userId) === String(userId)) {
    profileDto.domain_verification_token = profile.domain_verification_token || null;
  }

  return {
    user: toUserDto(user),
    profile: profileDto,
    projects: projects.map(toProjectDto),
    skills: skills.map(toSkillDto),
  };
};

const toPublicProfileDto = (profile) => ({
  id: profile.userId,
  username: profile.username,
  full_name: profile.full_name,
  title: profile.title,
  bio: profile.bio,
  avatar_url: profile.avatar_url,
  location: profile.location,
  custom_domain: profile.custom_domain,
  template_id: profile.template_id,
  is_pro: profile.is_pro,
  public_url: `/u/${profile.username}`,
});

export const getMyPortfolio = async (req, res, next) => {
  try {
    
    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      const user = await User.findById(req.userId).select("name email");
      const defaultBase = (user && (user.name || user.email)) ? (user.name || user.email.split("@")[0]) : "user";
      const defaultUsername = await generateUniqueUsername(defaultBase);
      profile = await Profile.create({ userId: req.userId, username: defaultUsername, full_name: user?.name || "" });
    }

    const payload = await buildPortfolioPayload(req.userId);
    if (!payload) return res.status(404).json({ message: "Profile not found" });

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getPublicPortfolio = async (req, res, next) => {
  try {
    const profile = await findProfileByIdentifier(req.params.username);

    if (!profile) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const payload = await buildPortfolioPayload(profile.userId);
    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getPublicPortfolioByDomain = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ custom_domain: normalizeIdentifier(req.params.hostname) });

    if (!profile) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const payload = await buildPortfolioPayload(profile.userId);
    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getAllPublicProfiles = async (_req, res, next) => {
  try {
    const profiles = await Profile.find().sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      profiles: profiles.map(toPublicProfileDto),
    });
  } catch (error) {
    return next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      
      const user = await User.findById(req.userId).select("name email");
      const defaultBase = (user && (user.name || user.email)) ? (user.name || user.email.split("@")[0]) : "user";
      const defaultUsername = await generateUniqueUsername(defaultBase);
      profile = await Profile.create({ userId: req.userId, username: defaultUsername, full_name: user?.name || "" });
    }

    const updatableFields = [
      "username",
      "full_name",
      "title",
      "bio",
      "avatar_url",
      "resume_url",
      "location",
      "email_public",
      "github_url",
      "linkedin_url",
      "twitter_url",
      "website_url",
      "custom_domain",
    ];

    for (const field of updatableFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        profile[field] = req.body[field] || null;
      }
    }

    if (!profile.full_name) profile.full_name = "";
    if (!profile.title) profile.title = "";
    if (!profile.bio) profile.bio = "";

    if (req.body.username) {
      profile.username = String(req.body.username).toLowerCase().trim();
      const existing = await Profile.findOne({ username: profile.username, userId: { $ne: req.userId } });
      if (existing) {
        return res.status(409).json({ message: "Username is already taken" });
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "custom_domain")) {
      const requestedDomain = normalizeIdentifier(req.body.custom_domain)
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

      if (requestedDomain) {
        
        if (!profile.is_pro) {
          return res.status(403).json({ message: "Custom domains require a Pro account" });
        }

        const existingDomain = await Profile.findOne({ custom_domain: requestedDomain, userId: { $ne: req.userId } });
        if (existingDomain) {
          return res.status(409).json({ message: "Custom domain is already in use" });
        }

        
        if (profile.custom_domain !== requestedDomain) {
          profile.custom_domain = requestedDomain;
          profile.custom_domain_verified = false;
          profile.domain_verification_token = require("crypto").randomBytes(16).toString("hex");
        }
      } else {
        
        profile.custom_domain = null;
        profile.custom_domain_verified = false;
        profile.domain_verification_token = null;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(req.body, "templateId") ||
      Object.prototype.hasOwnProperty.call(req.body, "template_id")
    ) {
      const templateId = req.body.templateId || req.body.template_id || "minimalist";
      const user = await User.findById(req.userId);
      if (user) {
        user.templateId = templateId;
        await user.save();
      }
      profile.template_id = templateId;
    }

    await profile.save();

    return res.status(200).json({ profile: toProfileDto(profile) });
  } catch (error) {
    return next(error);
  }
};

export const deleteMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await Promise.all([
      Project.deleteMany({ userId: req.userId }),
      Skill.deleteMany({ userId: req.userId }),
      ContactMessage.deleteMany({ recipientId: req.userId }),
      Profile.deleteOne({ userId: req.userId }),
      User.deleteOne({ _id: req.userId }),
    ]);

    return res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      userId: req.userId,
      title: req.body.title || "Untitled project",
      description: req.body.description || "",
      tech_stack: Array.isArray(req.body.tech_stack) ? req.body.tech_stack : [],
      repo_url: req.body.repo_url || null,
      live_url: req.body.live_url || null,
      screenshot_url: req.body.screenshot_url || null,
      position: Number.isFinite(req.body.position) ? req.body.position : 0,
    });

    return res.status(201).json({ project: toProjectDto(project) });
  } catch (error) {
    return next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, userId: req.userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatableFields = ["title", "description", "tech_stack", "repo_url", "live_url", "screenshot_url", "position"];
    for (const field of updatableFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        project[field] = req.body[field] || null;
      }
    }

    if (!project.title) project.title = "Untitled project";
    if (!Array.isArray(project.tech_stack)) project.tech_stack = [];
    if (project.description == null) project.description = "";

    await project.save();

    return res.status(200).json({ project: toProjectDto(project) });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const result = await Project.deleteOne({ _id: req.params.projectId, userId: req.userId });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const verifyDomain = async (req, res, next) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) return res.status(400).json({ message: "Missing token" });

    const profile = await Profile.findOne({ domain_verification_token: token });
    if (!profile) return res.status(404).json({ message: "Verification token not found" });

    const hostname = String((req.hostname || req.get("host") || "")).toLowerCase();
    const expected = String(profile.custom_domain || "").toLowerCase();

    if (!expected || !hostname.includes(expected)) {
      return res.status(400).json({ message: "Host header does not match the expected custom domain" });
    }

    profile.custom_domain_verified = true;
    profile.domain_verification_token = null;
    await profile.save();

    return res.status(200).json({ success: true, message: "Domain verified" });
  } catch (error) {
    return next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create({
      userId: req.userId,
      category: req.body.category,
      name: req.body.name,
      position: Number.isFinite(req.body.position) ? req.body.position : 0,
    });

    return res.status(201).json({ skill: toSkillDto(skill) });
  } catch (error) {
    return next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const result = await Skill.deleteOne({ _id: req.params.skillId, userId: req.userId });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};
