// models/projectModel.js
import db from "./db.js";

const Project = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const {
      uuid,
      title,
      summary,
      description,
      project_officer_id,
      status,
      start_date,
      end_date,
      estimated_budget,
    } = data;

    const [result] = await db.query(
      `INSERT INTO projects 
        (uuid, title, summary, description, project_officer_id, status, start_date, end_date, estimated_budget)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        title,
        summary,
        description,
        project_officer_id,
        status,
        start_date,
        end_date,
        estimated_budget,
      ]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    await db.query(`UPDATE projects SET ${fields.join(", ")} WHERE id = ?`, values);
  },

  delete: async (id) => {
    await db.query("DELETE FROM projects WHERE id = ?", [id]);
  },
};

export default Project;
