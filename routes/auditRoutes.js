import express from "express";
import { listAudits } from "../controllers/auditController.js";
import { requireRole } from "../middleware/authRole.js";

const router = express.Router();

// Only auditors, captains, and admins can view logs
router.get("/", requireRole(["auditor", "captain", "sysadmin"]), listAudits);

export default router;
