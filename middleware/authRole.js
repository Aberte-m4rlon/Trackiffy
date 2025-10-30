// middleware/authRole.js
import db from "../models/db.js";
// middleware/authRole.js
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const userRole = req.session.userRole;
    if (!allowedRoles.includes(userRole)) {
      console.warn(`🚫 Access denied for role: ${userRole}`);
      return res.status(403).render("403.xian", {
        title: "Access Denied",
        message: `You do not have permission to access this page.`,
      });
    }

    next();
  };
};

