import Report from "../models/reportModel.js";
import { exportCSV, exportPDF } from "../utils/exportHelper.js";

export const budgetUtilization = async (req, res) => {
  const data = await Report.budgetUtilization();

  if (req.query.export === "csv") return exportCSV(res, "budget_utilization.csv", data);
  if (req.query.export === "pdf") return exportPDF(res, "Budget Utilization Report", data);

  res.render("report.xian", { title: "Budget Utilization", data });
};

export const disbursementLedger = async (req, res) => {
  const data = await Report.disbursementLedger();
  if (req.query.export === "csv") return exportCSV(res, "disbursement_ledger.csv", data);
  if (req.query.export === "pdf") return exportPDF(res, "Disbursement Ledger", data);

  res.render("report.xian", { title: "Disbursement Ledger", data });
};

export const projectStatus = async (req, res) => {
  const data = await Report.projectStatus();
  if (req.query.export === "csv") return exportCSV(res, "project_status.csv", data);
  if (req.query.export === "pdf") return exportPDF(res, "Project Status", data);

  res.render("report.xian", { title: "Project Status", data });
};

export const statementOfAppropriations = async (req, res) => {
  const data = await Report.statementOfAppropriations();
  if (req.query.export === "csv") return exportCSV(res, "statement_of_appropriations.csv", data);
  if (req.query.export === "pdf") return exportPDF(res, "Statement of Appropriations", data);

  res.render("report.xian", { title: "Statement of Appropriations", data });
};
