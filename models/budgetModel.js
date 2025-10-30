// models/budgetModel.js
import db from "./db.js";

const Budget = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT b.*, p.title AS project_title 
      FROM budgets b 
      JOIN projects p ON p.id = b.project_id
      ORDER BY b.created_at DESC
    `);
    return rows;
  },

  getByProject: async (projectId) => {
    const [rows] = await db.query(
      "SELECT * FROM budgets WHERE project_id = ?",
      [projectId]
    );
    return rows;
  },

  getUtilization: async () => {
    const [rows] = await db.query(`
      SELECT 
        p.title AS project,
        b.allocated_amount,
        b.spent_amount,
        ROUND((b.spent_amount / b.allocated_amount) * 100, 2) AS utilization_rate
      FROM budgets b
      JOIN projects p ON p.id = b.project_id
    `);
    return rows;
  },
};

export default Budget;
