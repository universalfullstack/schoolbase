import express from "express";
import { getSettingsPage, updateSettings } from "../controllers/super_admin/appSettingController.js";
import { uploadSingleFiles } from "../utils/imageUploader.js";

const router = express.Router();

// -----------------------------
// Routes
// -----------------------------
router.get("/", getSettingsPage);

// Use the upload utility for logo & favicon
router.post(
  "/",
  uploadSingleFiles([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
  ]),
  updateSettings
);

export default router;
