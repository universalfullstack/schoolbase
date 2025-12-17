
// Middleware to protect routes
export function ensureRole(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    req.flash('error', `Please log in as ${role}`);
    res.redirect('/login');
  };
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to continue');
  res.redirect('/login');
}