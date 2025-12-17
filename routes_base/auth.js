import express from 'express';
import passport from 'passport';

const router = express.Router();

// POST login
router.post(
  '/login',
  (req, res, next) => {
    // Wrap passport.authenticate so we can access req.body.rememberMe
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash('error', info.message);
        return res.redirect('/login');
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        // ---------------- Remember Me ----------------
        if (req.body.rememberMe === 'on') {
          // Set cookie for 30 days
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
        } else {
          // Session expires on browser close
          req.session.cookie.expires = false;
        }
        // --------------------------------------------

        // Role-based redirect
        const role = user.role;
        switch (role) {
          case 'Super Admin':
            return res.redirect('/super-admin/dashboard');
          case 'School Admin':
            return res.redirect('/school-admin/dashboard');
          case 'Staff':
            return res.redirect('/staff/dashboard');
          case 'Guardian':
            return res.redirect('/guardian/dashboard');
          default:
            return res.redirect('/');
        }
      });
    })(req, res, next);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

export default router;
