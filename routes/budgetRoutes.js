import express from "express";
import { listBudgets, viewUtilization } from "../controllers/budgetController.js";

const router = express.Router();
router.get("/", listBudgets);
router.get("/utilization", viewUtilization);

export default router;
