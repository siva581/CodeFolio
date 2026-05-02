import { Profile } from "../models/Profile.js";

const sanitizeUsername = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);

export const generateUniqueUsername = async (seed) => {
  const base = sanitizeUsername(seed) || "user";
  let candidate = base.length >= 2 ? base : `${base}01`;
  let suffix = 0;

  while (await Profile.exists({ username: candidate })) {
    suffix += 1;
    const withSuffix = `${base}${suffix}`;
    candidate = withSuffix.slice(0, 32);
  }

  return candidate;
};
