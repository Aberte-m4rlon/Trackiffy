// models/disbursementModel.js
import db from "./db.js";

const Disbursement = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT d.*, p.title AS project_title 
      FROM disbursements d 
      JOIN projects p ON d.project_id = p.id
      ORDER BY d.date_released DESC
    `);
    return rows;
  },

  create: async (data) => {
    const { project_id, amount, purpose, date_released, approved_by } = data;
    const [result] = await db.query(
      `INSERT INTO disbursements 
       (project_id, amount, purpose, date_released, approved_by)
       VALUES (?, ?, ?, ?, ?)`,
      [project_id, amount, purpose, date_released, approved_by]
    );
    return result.insertId;
  },
};

export default Disbursement;
