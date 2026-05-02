import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { generateUniqueUsername } from "../utils/username.js";

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      templateId: "minimalist",
    });

    const defaultUsername = await generateUniqueUsername(name || email.split("@")[0]);
    await Profile.create({
      userId: user._id.toString(),
      username: defaultUsername,
      full_name: name,
    });

    return res.status(201).json({
      token: signToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        templateId: user.templateId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      token: signToken(user._id.toString()),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        templateId: user.templateId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("_id name email templateId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        templateId: user.templateId,
      },
    });
  } catch (error) {
    return next(error);
  }
};
