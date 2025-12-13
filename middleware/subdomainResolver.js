import School from "../models/School.js";
import schoolRoutes from '../routes_school/index.js';

export default async (req, res, next) => {
  // Extract subdomain
  const schoolSubdomain = req.subdomains[0]; // first subdomain
  if (!schoolSubdomain) return next();

  try {
    // Find the school by subdomain
    const school = await School.findOne({ subdomain: schoolSubdomain, deletedAt: null }).lean();
    if (!school) return res.status(404).send("School not found");

    // Attach school info to request and response locals
    req.school = school;
    res.locals.school = school;

    // Proceed to school-specific routes
    schoolRoutes(req, res, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
}