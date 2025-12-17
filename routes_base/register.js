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
  try {
    const schools = await School.find({ deletedAt: null })
      .select("name")
      .lean();

    res.render("register", {
      layout: "auth",
      title: "User Registration",
      schools
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500", {
      title: "Server Error"
    });
  }
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

    if (!data.password) {
      req.flash("error", "Password is required");
      return res.redirect("/register");
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
        return res.redirect("/register");
    }

    req.flash("success", "Registration successful");
    return res.redirect("/login");

  } catch (error) {
    console.error(error);

    /* ===============================
       Duplicate Email / Phone Error
    ================================ */
    if (error.code === 11000 && error.keyValue) {
      const field = Object.keys(error.keyValue)[0];

      if (field === "email") {
        req.flash("error", "Email address already exists");
      } else if (field === "phone") {
        req.flash("error", "Phone number already exists");
      } else {
        req.flash("error", "Duplicate value detected");
      }

      return res.redirect("/register");
    }

    // Fallback error
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/register");
  }
});

export default router;
