import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome')
})

// GET login page
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'auth',
        title: 'Super Admin Login'
    })
});

// Auth routes
router.use('/auth', authRoutes)

export default router;