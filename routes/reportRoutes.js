import express from "express";
import { getAllReports, createReport } from "../controllers/reportController.js";

const router = express.Router();

// ✅ Default route for /reports
router.get("/", getAllReports); // Handles GET /reports

// Optional: Add a route for creating reports if needed
router.post("/", createReport);

export default router;
