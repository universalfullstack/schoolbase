import express from "express";
import { renderProfile, updateProfile } from "../controllers/profileController.js";
import { uploadSingle } from "../utils/imageUploader.js";
import { ensureAuthenticated } from '../middleware/auth.js';


const router = express.Router();

router.use(ensureAuthenticated);

// GET profile page
router.get("/", renderProfile);

// POST profile update with profile image upload
router.post("/", uploadSingle("profileImage"), updateProfile);

export default router;
