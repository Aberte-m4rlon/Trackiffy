import Project from "../models/projectModel.js";
import { v4 as uuidv4 } from "uuid";

export const listProjects = async (req, res) => {
  const projects = await Project.getAll();
  res.render("project.xian", { projects });
};

export const showCreateForm = (req, res) => {
  res.render("project_create.xian");
};

export const createProject = async (req, res) => {
  try {
    const data = {
      uuid: uuidv4(),
      title: req.body.title,
      summary: req.body.summary,
      description: req.body.description,
      project_officer_id: req.session?.user?.id || null,
      status: "draft",
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      estimated_budget: req.body.estimated_budget,
    };
    await Project.create(data);
    res.redirect("/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating project");
  }
};
export const approveProject = async (req, res) => {
  try {
    const id = req.params.id;
    await Project.update(id, { status: "approved" });
    await db.query(
      "INSERT INTO audit_logs (action, user_id, project_id, description) VALUES (?, ?, ?, ?)",
      ["APPROVE_PROJECT", req.session.user.id, id, "Project approved by Barangay Captain"]
    );
    res.redirect("/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error approving project");
  }
};
