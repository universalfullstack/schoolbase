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
router.get("/:role", async (req, res) => {
  const { role } = req.params;

  const schools = await School.find().select("name");

  const allowedRoles = ["school-admin", "staff", "guardian", "student"];
  if (!allowedRoles.includes(role)) {
    return res.status(404).render("errors/404");
  }

  res.render("register", {
    title: `${role.replace("-", " ")} Registration`,
    role,
    schools
  });
});

/* ===============================
   Handle Registration
================================ */
router.post("/:role", async (req, res) => {
  try {
    const { role } = req.params;
    const data = req.body;

    data.password = await hashPassword(data.password);

    switch (role) {
      case "school-admin":
        await SchoolAdmin.create({
          ...data,
          schools: data.schools ? [data.schools] : []
        });
        break;

      case "staff":
        await Staff.create({
          ...data,
          school: data.school
        });
        break;

      case "guardian":
        await Guardian.create({
          ...data,
          school: data.school
        });
        break;

      case "student":
        await Student.create({
          ...data,
          school: data.school
        });
        break;

      default:
        req.flash("error", "Invalid registration role");
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
