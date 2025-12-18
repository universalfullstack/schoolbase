import express from 'express';
import { renderSuperAdminDashboard } from '../controllers/super_admin/dashboardController.js';
import { renderProfile, updateProfile } from '../controllers/user/profileController.js';
import schoolRoutes from './school.js';
import settingRoutes from './setting.js';
import planRoutes from './plan.js';
import subscriptionRoutes from './subscription.js';
import { uploadSingle } from "../../utils/imageUploader";
const router = express.Router();

// GET dashboard
router.get('/dashboard', renderSuperAdminDashboard);

// Profile routes
router.get('/profile', renderProfile)
router.post('/profile', uploadSingle("profileImage"), updateProfile)

// Schools routes
router.use('/schools', schoolRoutes);

// Setting routes
router.use('/settings', settingRoutes);


// Settings routes
router.use('/settings', settingRoutes);

// Plans routes
router.use('/plans', planRoutes);

// Subscription routes
router.use('/subscriptions', subscriptionRoutes);

/* SUPER ADMIN 404 — MUST BE LAST */
router.use((req, res) => {
  res.status(404).render('error', {
    layout: 'super-admin',
    title: 'Super Admin Page Not Found',
    message: 'This super admin page does not exist.',
    backUrl: '/super-admin/dashboard'
  });
});

export default router;