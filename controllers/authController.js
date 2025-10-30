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

export const loginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

export const registerPage = (req, res) => {
  res.render("register", { title: "Register" });
};

export const forgotPasswordPage = (req, res) => {
  res.render("forgotpassword", { title: "Forgot Password" });
};

export const dashboardPage = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("dashboard", { 
    title: "Dashboard",
    userName: req.session.userName,
    userRole: req.session.userRole
  });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", { title: "Login", error: "Please fill all fields." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("login", { title: "Login", error: "User not found." });
    }

    // 🔹 Handle empty passwords for dummy users
    if (!user.password_hash) {
      console.warn(`⚠️ User ${email} has no password set. Allowing dummy login for dev.`);
      req.session.userId = user.id;
      req.session.userName = user.display_name;
      req.session.userRole = user.role || "citizen"; // ✅ role added here
      return res.redirect("/dashboard");
    }

    // 🔹 Compare hashed password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render("login", { title: "Login", error: "Incorrect password." });
    }

    // 🔹 Successful login
    req.session.userId = user.id;
    req.session.userName = user.display_name;
    req.session.userRole = user.role || "citizen"; // ✅ store role in session
    console.log(`✅ Login success: ${email} [Role: ${req.session.userRole}]`);
    res.redirect("/dashboard");
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Server error during login.");
  }
};

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
      role: role || "citizen", // ✅ default role
      is_active: 1,
    });

    req.session.userId = newUser.id;
    req.session.userName = newUser.display_name;
    req.session.userRole = newUser.role;
    res.redirect("/dashboard");
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).send("Error during registration.");
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("❌ Session destroy error:", err);
    res.redirect("/login");
  });
};
