import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Profile } from "../src/models/Profile.js";
import { Project } from "../src/models/Project.js";
import { Skill } from "../src/models/Skill.js";
import { User } from "../src/models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/intern_web";

const demoUsers = [
  {
    email: "demo1@example.com",
    name: "Demo Developer",
    username: "demo1",
    full_name: "Demo Developer",
    title: "Full Stack Engineer",
    bio: "Building amazing products with MERN stack. Open to opportunities and collaborations.",
    location: "San Francisco, CA",
    avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=demo1",
    email_public: "demo@codefolio.dev",
    template_id: "minimalist",
    is_pro: true,
    projects: [
      {
        title: "CodeFolio - Portfolio Builder",
        description: "A full-stack MERN application that helps developers create stunning portfolios in minutes.",
        tech_stack: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
        repo_url: "https://github.com/demo/codefolio",
        live_url: "https://codefolio.dev",
        screenshot_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
        position: 1,
      },
      {
        title: "TaskPro - Project Management",
        description: "Collaborative task management platform with real-time updates and team analytics.",
        tech_stack: ["React", "Firebase", "Material UI", "Redux"],
        repo_url: "https://github.com/demo/taskpro",
        live_url: "https://taskpro.io",
        screenshot_url: "https://images.unsplash.com/photo-1555066931-4365d440a117?w=500",
        position: 2,
      },
      {
        title: "DevChat API",
        description: "RESTful API for real-time messaging with WebSocket support.",
        tech_stack: ["Node.js", "Express", "PostgreSQL", "WebSocket"],
        repo_url: "https://github.com/demo/devchat-api",
        screenshot_url: "https://images.unsplash.com/photo-1517694712422-85d4a4b6a3a6?w=500",
        position: 3,
      },
    ],
    skills: [
      { category: "frontend", name: "React", position: 1 },
      { category: "frontend", name: "TypeScript", position: 2 },
      { category: "frontend", name: "TailwindCSS", position: 3 },
      { category: "backend", name: "Node.js", position: 1 },
      { category: "backend", name: "Express", position: 2 },
      { category: "backend", name: "MongoDB", position: 3 },
      { category: "devops", name: "Git", position: 1 },
      { category: "devops", name: "Docker", position: 2 },
      { category: "devops", name: "AWS", position: 3 },
    ],
  },
  {
    email: "demo2@example.com",
    name: "Sarah Designer",
    username: "demo2",
    full_name: "Sarah Designer",
    title: "Product Design Lead",
    bio: "Crafting beautiful user experiences. Passionate about accessibility and design systems.",
    location: "New York, NY",
    avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=demo2",
    email_public: "sarah@codefolio.dev",
    template_id: "corporate",
    is_pro: false,
    projects: [
      {
        title: "Design System v2.0",
        description: "Comprehensive design system with 100+ components and comprehensive documentation.",
        tech_stack: ["Figma", "React", "Storybook", "TypeScript"],
        live_url: "https://designsystem.io",
        screenshot_url: "https://images.unsplash.com/photo-1561716281-dac82265f828?w=500",
        position: 1,
      },
      {
        title: "E-commerce Platform Redesign",
        description: "Redesigned popular e-commerce platform improving conversion by 40%.",
        tech_stack: ["Figma", "Prototyping", "User Research", "A/B Testing"],
        screenshot_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
        position: 2,
      },
    ],
    skills: [
      { category: "frontend", name: "Figma", position: 1 },
      { category: "frontend", name: "UI Design", position: 2 },
      { category: "frontend", name: "Prototyping", position: 3 },
      { category: "backend", name: "User Research", position: 1 },
      { category: "backend", name: "Adobe Creative Suite", position: 2 },
      { category: "devops", name: "Git", position: 1 },
      { category: "devops", name: "Notion", position: 2 },
    ],
  },
];

async function removeExistingDemoData() {
  const existingProfiles = await Profile.find({ username: { $in: demoUsers.map((user) => user.username) } }).select("userId");
  const existingUsers = await User.find({ email: { $in: demoUsers.map((user) => user.email) } }).select("_id");

  const userIds = [
    ...existingProfiles.map((profile) => profile.userId),
    ...existingUsers.map((user) => user._id.toString()),
  ];

  if (userIds.length) {
    await Promise.all([
      Project.deleteMany({ userId: { $in: userIds } }),
      Skill.deleteMany({ userId: { $in: userIds } }),
    ]);
  }

  await Promise.all([
    Profile.deleteMany({ username: { $in: demoUsers.map((user) => user.username) } }),
    User.deleteMany({ email: { $in: demoUsers.map((user) => user.email) } }),
  ]);
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await removeExistingDemoData();

    for (const demoUser of demoUsers) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = await User.create({
        name: demoUser.name,
        email: demoUser.email,
        password: hashedPassword,
      });

      await Profile.create({
        userId: user._id.toString(),
        username: demoUser.username,
        full_name: demoUser.full_name,
        title: demoUser.title,
        bio: demoUser.bio,
        location: demoUser.location,
        avatar_url: demoUser.avatar_url,
        email_public: demoUser.email_public,
        template_id: demoUser.template_id,
        is_pro: demoUser.is_pro,
      });

      if (demoUser.projects.length) {
        await Project.insertMany(
          demoUser.projects.map((project) => ({
            userId: user._id.toString(),
            ...project,
          })),
        );
      }

      if (demoUser.skills.length) {
        await Skill.insertMany(
          demoUser.skills.map((skill) => ({
            userId: user._id.toString(),
            ...skill,
          })),
        );
      }

      console.log(`Seeded ${demoUser.username}`);
    }

    console.log("Demo data seeded successfully.");
    console.log("http://localhost:5173/u/demo1");
    console.log("http://localhost:5173/u/demo2");
    console.log("Login: demo1@example.com / password123");
    console.log("Login: demo2@example.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
