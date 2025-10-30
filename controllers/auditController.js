import Audit from "../models/auditModel.js";

export const listAudits = async (req, res) => {
  const logs = await Audit.getAll();
  res.render("audit.xian", { logs });
};
