/*
  MIT License
  (c) 2025 Christian I. Cabrera || XianFire Framework
*/

import { sequelize } from "../models/userModel.js";
import { QueryTypes } from "sequelize";

export const dashboardData = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/login");

    // Default stats
    let stats = {
      totalProjects: 0,
      pendingProjects: 0,
      approvedProjects: 0,
      totalBudget: 0,
      utilizedBudget: 0,
      disbursementCount: 0,
    };

    // Example queries (replace with your real table names)
    const [projectStats] = await sequelize.query(
      `SELECT 
         COUNT(*) AS totalProjects,
         SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pendingProjects,
         SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approvedProjects,
         SUM(estimated_budget) AS totalBudget
       FROM projects;`,
      { type: QueryTypes.SELECT }
    );

    const [financeStats] = await sequelize.query(
      `SELECT 
         COUNT(*) AS disbursementCount,
         SUM(amount) AS utilizedBudget
       FROM disbursements;`,
      { type: QueryTypes.SELECT }
    );

    stats = { ...stats, ...projectStats, ...financeStats };

    res.render("dashboard", {
      title: "Dashboard",
      userName: req.session.userName,
      userRole: req.session.userRole,
      stats,
    });
  } catch (err) {
    console.error("❌ Dashboard data error:", err);
    res.status(500).send("Error loading dashboard data.");
  }
};
