import { Router } from "express";
import path from "path";
import { Profile } from "../models/Profile.js";

const router = Router();

const indexPath = path.join(process.cwd(), "frontend", "dist", "index.html");

router.get("/:username", async (req, res, next) => {
  try {
    const username = String(req.params.username || "").toLowerCase().trim();
    if (!username) return next();

    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).send("Not found");

    return res.sendFile(indexPath);
  } catch (err) {
    return next(err);
  }
});

export default router;
