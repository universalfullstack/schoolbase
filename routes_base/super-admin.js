import express from 'express';
import { ensureRole } from '../middleware/auth.js';
import { renderSuperAdminDashboard } from '../controllers/super_admin/dashboardController.js';
import { renderSuperAdminProfile } from '../controllers/super_admin/profileController.js';
import schoolRoutes from './school.js';
import settingRoutes from './setting.js';
import planRoutes from './plan.js';
import subscriptionRoutes from './subscription.js';

const router = express.Router();

router.use(ensureRole("Super Admin"));

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

// Plans routes
router.use('/plans', planRoutes);

// Subscription routes
router.use('/subscriptions', subscriptionRoutes);

/* SUPER ADMIN 404 — MUST BE LAST */
router.use((req, res) => {
  res.status(404).render('errors/404', {
    layout: 'super-admin',
    title: 'Super Admin Page Not Found',
    message: 'This super admin page does not exist.',
    backUrl: '/super-admin/dashboard'
  });
});

export default router;