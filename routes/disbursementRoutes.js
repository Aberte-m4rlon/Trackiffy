import express from "express";
import { showDisbursementForm, createDisbursement } from "../controllers/disbursementController.js";
import { requireRole } from "../middleware/authRole.js";

const router = express.Router();
router.get("/create", requireRole(["treasurer"]), showDisbursementForm);
router.post("/create", requireRole(["treasurer"]), createDisbursement);

export default router;
