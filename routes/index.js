/*
  MIT License
  Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
  Mindoro State University - Philippines
*/

import express from "express";
import { homePage } from "../controllers/homeController.js";
import { approveProject } from "../controllers/projectController.js";
import { dashboardData } from "../controllers/dashboardController.js";
import { requireRole } from "../middleware/authRole.js";

import projectRoutes from "./projectRoutes.js";
import budgetRoutes from "./budgetRoutes.js";
import reportRoutes from "./reportRoutes.js";
import disbursementRoutes from "./disbursementRoutes.js";
import auditRoutes from "./auditRoutes.js";



import {
  loginPage,
  registerPage,
  forgotPasswordPage,
  dashboardPage,
  loginUser,
  registerUser,
  logoutUser
} from "../controllers/authController.js";

const router = express.Router();

/* ---------- Middleware to Check Authentication ---------- */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login"); // redirect to login if not authenticated
  }
  next();
}

/* ---------- Redirect root to login ---------- */
router.get("/", (req, res) => {
  return res.redirect("/login");
});
router.get("/login", loginPage);
router.post("/auth/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);

/* ---------- Dashboard Routes ---------- */
router.get("/dashboard/:userId", dashboardPage);

router.get("/dashboard/data", dashboardData);

/* ---------- Protected Routes ---------- */
router.post("/:id/approve", requireRole(["captain"]), approveProject);

/* ---------- Modular Route Groups ---------- */
router.use("/projects", projectRoutes);
router.use("/budgets", budgetRoutes);
router.use("/reports", reportRoutes);
router.use("/disbursements", disbursementRoutes);
router.use("/audit", auditRoutes);

/* ---------- Logout ---------- */
router.get("/logout", logoutUser);

export default router;
