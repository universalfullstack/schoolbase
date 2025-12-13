
// Middleware to protect routes
export function ensureSuperAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'Super Admin') {
    return next();
  }
  req.flash('error', 'Please log in as Super Admin');
  res.redirect('/login');
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to continue');
  res.redirect('/login');
}