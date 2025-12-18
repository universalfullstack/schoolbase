import { SuperAdmin, SchoolAdmin, Staff, Guardian, Student } from "../../models/User.js";
import bcrypt from "bcrypt";

// Role → Model map
const ROLE_MODEL_MAP = {
  "School Admin": SchoolAdmin,
  "Staff": Staff,
  "Guardian": Guardian,
  "Student": Student
};

// Role → Config map
const ROLE_CONFIG_MAP = {
  "School Admin": { redirect: "/manage/school-admins", fields: ["firstName","lastName","email","phone"] },
  "Staff": { redirect: "/manage/staff", fields: ["firstName","lastName","email","phone","staffRoles"] },
  "Guardian": { redirect: "/manage/guardians", fields: ["firstName","lastName","email","phone"] },
  "Student": { redirect: "/manage/students", fields: ["firstName","lastName","email","phone","currentClassLevel","currentClassArm"] }
};

// ------------------- LIST USERS -------------------
export const listUsers = async (req, res) => {
  try {
    const role = req.params.role;
    const UserModel = ROLE_MODEL_MAP[role];
    if (!UserModel) return res.status(404).send("Invalid role");

    const users = await UserModel.find().populate("school currentClassLevel currentClassArm").lean();
    res.render("manage/users", { role, users, title: `${role} Management` });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ------------------- RENDER CREATE FORM -------------------
export const renderCreateUser = (req, res) => {
  const role = req.params.role;
  if (!ROLE_MODEL_MAP[role]) return res.status(404).send("Invalid role");

  res.render("manage/createUser", { role, title: `Create ${role}` });
};

// ------------------- CREATE USER -------------------
export const createUser = async (req, res) => {
  try {
    const role = req.params.role;
    const UserModel = ROLE_MODEL_MAP[role];
    const config = ROLE_CONFIG_MAP[role];
    if (!UserModel || !config) return res.status(404).send("Invalid role");

    const data = {};
    config.fields.forEach(field => {
      data[field] = req.body[field];
    });

    // Hash password
    data.password = await bcrypt.hash(req.body.password, 10);

    const newUser = new UserModel(data);
    await newUser.save();

    req.flash("success", `${role} created successfully`);
    res.redirect(config.redirect);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not create user");
    res.redirect("back");
  }
};

// ------------------- RENDER EDIT FORM -------------------
export const renderEditUser = async (req, res) => {
  try {
    const role = req.params.role;
    const UserModel = ROLE_MODEL_MAP[role];
    if (!UserModel) return res.status(404).send("Invalid role");

    const user = await UserModel.findById(req.params.id).lean();
    if (!user) return res.status(404).send("User not found");

    res.render("manage/createUser", { role, user, title: `Edit ${role}` });
  } catch (err) {
    console.error(err);
    res.redirect("back");
  }
};

// ------------------- UPDATE USER -------------------
export const updateUser = async (req, res) => {
  try {
    const role = req.params.role;
    const UserModel = ROLE_MODEL_MAP[role];
    const config = ROLE_CONFIG_MAP[role];
    if (!UserModel || !config) return res.status(404).send("Invalid role");

    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    config.fields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Update password if provided
    if (req.body.password && req.body.password.trim() !== "") {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    req.flash("success", `${role} updated successfully`);
    res.redirect(config.redirect);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not update user");
    res.redirect("back");
  }
};

// ------------------- DELETE USER -------------------
export const deleteUser = async (req, res) => {
  try {
    const role = req.params.role;
    const UserModel = ROLE_MODEL_MAP[role];
    const config = ROLE_CONFIG_MAP[role];
    if (!UserModel || !config) return res.status(404).send("Invalid role");

    await UserModel.findByIdAndDelete(req.params.id);
    req.flash("success", `${role} deleted successfully`);
    res.redirect(config.redirect);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not delete user");
    res.redirect("back");
  }
};
