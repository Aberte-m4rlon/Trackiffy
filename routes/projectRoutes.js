import express from "express";
import { listProjects, createProject, showCreateForm } from "../controllers/projectController.js";
import { requireRole } from "../middleware/authRole.js";

const router = express.Router();

// Everyone can view projects
router.get("/", listProjects);

// Only project officer and captain can create
router.get("/create", requireRole(["project_officer", "captain"]), showCreateForm);
router.post("/create", requireRole(["project_officer", "captain"]), createProject);

export default router;
