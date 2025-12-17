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
    res.render('auth/login', {
        layout: 'auth',
        title: 'Login'
    })
});

// Logout
router.get('/logout', ensureSuperAdmin, (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});


export default router;