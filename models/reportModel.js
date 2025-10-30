// models/reportModel.js
import db from "./db.js";

const Report = {
  budgetUtilization: async () => {
    const [rows] = await db.query(`
      SELECT p.title AS project, 
             b.allocated_amount, 
             b.spent_amount, 
             (b.spent_amount / b.allocated_amount) * 100 AS utilization
      FROM budgets b
      JOIN projects p ON p.id = b.project_id
    `);
    return rows;
  },

  disbursementLedger: async () => {
    const [rows] = await db.query(`
      SELECT p.title AS project, d.amount, d.purpose, d.date_released, d.approved_by
      FROM disbursements d
      JOIN projects p ON p.id = d.project_id
      ORDER BY d.date_released DESC
    `);
    return rows;
  },

  projectStatus: async () => {
    const [rows] = await db.query(`
      SELECT id, title, status, estimated_budget, start_date, end_date
      FROM projects
    `);
    return rows;
  },

  statementOfAppropriations: async () => {
    const [rows] = await db.query(`
      SELECT p.title AS project, b.allocated_amount, b.spent_amount, (b.allocated_amount - b.spent_amount) AS balance
      FROM budgets b
      JOIN projects p ON p.id = b.project_id
    `);
    return rows;
  },
};

export default Report;
