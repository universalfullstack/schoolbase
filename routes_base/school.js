import express from "express";
import {
  listSchools,
  renderCreateSchool,
  createSchool,
  renderEditSchool,
  updateSchool,
  deleteSchool
  activateSchool,
  viewSchool
} from "../controllers/super_admin/schoolController.js";

import { uploadSingle } from "../utils/imageUploader.js";

const router = express.Router();


// List all schools
router.get("/", listSchools);

// View single school
router.get("/view/:id", viewSchool);

// Create school
router.get("/create/new", renderCreateSchool);
router.post("/create/new", uploadSingle('logo'), createSchool);

// Edit school
router.get("/edit/:id", renderEditSchool);
router.post("/edit/:id", uploadSingle("logo"), updateSchool);

// Activate school
router.post("/activate/:id", activateSchool);

// Soft delete school
router.post("/delete/:id", deleteSchool);

export default router;
