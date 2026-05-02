import { Router } from "express";
import {
  createProject,
  createSkill,
  deleteProject,
  deleteSkill,
  getPublicPortfolioByDomain,
  getMyPortfolio,
  getPublicPortfolio,
  getAllPublicProfiles,
  deleteMyProfile,
  updateMyProfile,
  verifyDomain,
  updateProject,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/domain/:hostname", getPublicPortfolioByDomain);
router.get("/u/:username", getPublicPortfolio);
router.get("/all", getAllPublicProfiles);

router.get("/me", protect, getMyPortfolio);
router.put("/me/profile", protect, updateMyProfile);
router.get("/verify-domain", verifyDomain);
router.delete("/me/profile", protect, deleteMyProfile);
router.post("/me/projects", protect, createProject);
router.put("/me/projects/:projectId", protect, updateProject);
router.delete("/me/projects/:projectId", protect, deleteProject);
router.post("/me/skills", protect, createSkill);
router.delete("/me/skills/:skillId", protect, deleteSkill);
router.get("/:username", getPublicPortfolio);

export default router;
