import express from 'express';
import authRoutes from './auth.js';
import superAdminRoutes from './super-admin.js';
import { ensureSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('base-home', {
        title: 'Base Home'
    })
});


router.get('/login', (req, res) => {
    res.render('super-admin/login', {
        layout: 'super-admin-auth',
        title: 'Super Admin Login'
    })
});

// GET dashboard
router.get('/dashboard', ensureSuperAdmin, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Logout
router.get('/logout', ensureSuperAdmin, (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Super Admin routes
router.use('/super-admin', superAdminRoutes);

export default router;