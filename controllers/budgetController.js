import Budget from "../models/budgetModel.js";

export const listBudgets = async (req, res) => {
  const budgets = await Budget.getAll();
  res.render("budget.xian", { budgets });
};

export const viewUtilization = async (req, res) => {
  const data = await Budget.getUtilization();
  res.render("report.xian", { data });
};
