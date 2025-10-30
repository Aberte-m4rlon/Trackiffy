/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";

try {
  await sequelize.sync();
  console.log("✅ User model synchronized successfully.");
} catch (err) {
  console.error("❌ Sequelize sync failed:", err);
}

/* ---------- PAGE RENDERS ---------- */
export const loginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

export const registerPage = (req, res) => {
  res.render("register", { title: "Register" });
};

export const forgotPasswordPage = (req, res) => {
  res.render("forgotpassword", { title: "Forgot Password" });
};

/* ---------- DASHBOARD ---------- */
export const dashboardPage = async (req, res) => {
  const { userId } = req.params;

  // ✅ Check if logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  // ✅ Prevent access to other users' dashboards
  if (parseInt(userId) !== parseInt(req.session.userId)) {
    console.warn(`🚫 Unauthorized access attempt: ${req.session.userId} tried to access /dashboard/${userId}`);
    return res.redirect(`/dashboard/${req.session.userId}`);
  }

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      req.session.destroy(() => res.redirect("/login"));
      return;
    }

    // ✅ Determine which dashboard to render based on role
    let dashboardView = "dashboard"; // default fallback

    switch (user.role) {
      case "captain":
        dashboardView = "dashboard-captain";
        break;
      case "treasurer":
        dashboardView = "dashboard-treasurer";
        break;
      case "project_officer":
        dashboardView = "dashboard-project_officer";
        break;
      case "auditor":
        dashboardView = "dashboard-auditor";
        break;
      case "citizen":
        dashboardView = "dashboard-citizen";
        break;
      default:
        dashboardView = "dashboard";
        break;
    }

    res.render(dashboardView, {
      title: "Dashboard",
      userName: user.display_name,
      userRole: user.role,
      userId: user.id
    });
  } catch (err) {
    console.error("❌ Dashboard load error:", err);
    res.status(500).send("Error loading dashboard.");
  }
};

/* ---------- LOGIN ---------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      if (req.headers["content-type"]?.includes("application/json")) {
        return res.json({ success: false, error: "Please fill all fields." });
      }
      return res.render("login", { title: "Login", error: "Please fill all fields." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      if (req.headers["content-type"]?.includes("application/json")) {
        return res.json({ success: false, error: "User not found." });
      }
      return res.render("login", { title: "Login", error: "User not found." });
    }

    // Allow dummy accounts (no password) for testing
    if (!user.password_hash) {
      req.session.userId = user.id;
      req.session.userName = user.display_name;
      req.session.userRole = user.role || "citizen";

      if (req.headers["content-type"]?.includes("application/json")) {
        return res.json({ success: true, userId: user.id, role: user.role });
      }

      return res.redirect(`/dashboard/${user.id}`);
    }

    // Compare password hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      if (req.headers["content-type"]?.includes("application/json")) {
        return res.json({ success: false, error: "Incorrect password." });
      }
      return res.render("login", { title: "Login", error: "Incorrect password." });
    }

    // ✅ Success: Store session info
    req.session.userId = user.id;
    req.session.userName = user.display_name;
    req.session.userRole = user.role || "citizen";

    console.log(`✅ Login success: ${email} [Role: ${req.session.userRole}]`);

    // ✅ Send JSON response if AJAX, else redirect normally
    if (req.headers["content-type"]?.includes("application/json")) {
      return res.json({
        success: true,
        userId: user.id,
        role: user.role || "citizen"
      });
    }

    res.redirect(`/dashboard/${user.id}`);
  } catch (err) {
    console.error("❌ Login error:", err);

    if (req.headers["content-type"]?.includes("application/json")) {
      return res.status(500).json({ success: false, error: "Server error during login." });
    }

    res.status(500).send("Server error during login.");
  }
};


/* ---------- REGISTER ---------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.render("register", { title: "Register", error: "All fields required." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.render("register", { title: "Register", error: "Email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      display_name: name,
      email,
      password_hash: hashed,
      role: role || "citizen",
      is_active: 1,
    });

    req.session.userId = newUser.id;
    req.session.userName = newUser.display_name;
    req.session.userRole = newUser.role;

    res.redirect(`/dashboard/${newUser.id}`);
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).send("Error during registration.");
  }
};

/* ---------- LOGOUT ---------- */
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("❌ Session destroy error:", err);
    res.redirect("/login");
  });
};
