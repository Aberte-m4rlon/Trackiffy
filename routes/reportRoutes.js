import express from "express";
import {
  budgetUtilization,
  disbursementLedger,
  projectStatus,
  statementOfAppropriations,
} from "../controllers/reportController.js";

const router = express.Router();
router.get("/budget-utilization", budgetUtilization);
router.get("/disbursement-ledger", disbursementLedger);
router.get("/project-status", projectStatus);
router.get("/appropriations", statementOfAppropriations);

export default router;
