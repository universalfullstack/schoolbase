import express from 'express';
import { ensureSuperAdmin } from '../middleware/auth.js';
import { renderSuperAdminDashboard } from '../controllers/super_admin/dashboardController.js';
import { renderSuperAdminProfile } from '../controllers/super_admin/profileController.js';
import schoolRoutes from './school.js';
import settingRoutes from './setting.js';

const router = express.Router();

router.use(ensureSuperAdmin);

// GET dashboard
router.get('/dashboard', renderSuperAdminDashboard);

// Schools routes
router.use('/schools', schoolRoutes);

// Setting routes
router.use('/settings', settingRoutes);

// Super Admin profile routes
router.use('/profile', renderSuperAdminProfile);

// Settings routes
router.use('/settings', settingRoutes);

export default router;