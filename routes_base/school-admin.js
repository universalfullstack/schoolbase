import express from 'express';
import {
renderSchoolAdminDashboard
} from '../controllers/school_admin/dashboardController.js';

const router = express.Router();

// Apply authentication and alerts middleware to all school-admin routes

// Dashboard
router.get('/dashboard', renderSchoolAdminDashboard);

export default router;