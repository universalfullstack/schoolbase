import express from 'express';
import { ensureRole } from '../middleware/auth.js';
import { schoolAlerts } from '../middleware/schoolAlerts.js';
import {
renderSchoolAdminDashboard
} from '../controllers/school_admin/dashboardController.js';

const router = express.Router();

// Apply authentication and alerts middleware to all school-admin routes
router.use(ensureRole("School Admin"));
router.use(schoolAlerts);

// Dashboard
router.get('/dashboard', renderSchoolAdminDashboard);

export default router;