import express from "express";
import {
  listUsers,
  renderCreateUser,
  createUser,
  renderEditUser,
  updateUser,
  deleteUser
} from "../controllers/user/manageController.js";

const router = express.Router();

// CRUD routes per role
router.get("/:role", listUsers);
router.get("/:role/create", renderCreateUser);
router.post("/:role/create", createUser);
router.get("/:role/:id/edit", renderEditUser);
router.post("/:role/:id/edit", updateUser);
router.post("/:role/:id/delete", deleteUser);

export default router;
