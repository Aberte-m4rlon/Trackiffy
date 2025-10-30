// models/auditModel.js
import db from "./db.js";

const Audit = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT a.*, u.display_name AS user_name, p.title AS project_title
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.user_id
      LEFT JOIN projects p ON p.id = a.project_id
      ORDER BY a.created_at DESC
    `);
    return rows;
  },
};

export default Audit;
