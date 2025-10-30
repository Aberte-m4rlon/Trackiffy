import Disbursement from "../models/disbursementModel.js";

export const showDisbursementForm = (req, res) => {
  res.render("disbursement_create.xian");
};

export const createDisbursement = async (req, res) => {
  try {
    const data = {
      project_id: req.body.project_id,
      amount: req.body.amount,
      purpose: req.body.purpose,
      date_released: req.body.date_released,
      approved_by: req.session?.user?.name || "Treasurer",
    };
    await Disbursement.create(data);
    res.redirect("/reports/disbursement-ledger");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating disbursement");
  }
};
