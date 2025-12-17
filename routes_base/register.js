import express from "express";
import bcrypt from "bcrypt";
import { SchoolAdmin, Staff, Guardian, Student } from "../models/User.js";
import School from "../models/School.js";

const router = express.Router();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/* ===============================
   Render Registration Form
================================ */
router.get("/", async (req, res) => {
  const schools = await School.find({ deletedAt: null }).select("name").lean();

  res.render("register", {
    layout: "auth",
    title: "User Registration",
    schools
  });
});

/* ===============================
   Handle Registration
================================ */
router.post("/", async (req, res) => {
  try {
    const { role, ...data } = req.body;

    if (!role) {
      req.flash("error", "Please select a role");
      return res.redirect("back");
    }

    data.password = await hashPassword(data.password);

    switch (role) {
      case "School Admin":
        await SchoolAdmin.create({
          ...data,
          schools: data.schools ? [data.schools] : []
        });
        break;

      case "Staff":
        await Staff.create({
          ...data,
          school: data.school
        });
        break;

      case "Guardian":
        await Guardian.create({
          ...data,
          school: data.school
        });
        break;

      case "Student":
        await Student.create({
          ...data,
          school: data.school
        });
        break;

      default:
        req.flash("error", "Invalid role selected");
        return res.redirect("back");
    }

    req.flash("success", "Registration successful");
    res.redirect("/login");

  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
});

export default router;
