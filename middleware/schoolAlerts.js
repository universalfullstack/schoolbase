import FeeInvoice from '../models/FeeInvoice.js';

// Middleware to add school-specific alerts (e.g., overdue invoices) to res.locals
export const schoolAlerts = async (req, res, next) => {
  try {
    if (!req.user?.school) {
      res.locals.alerts = {};
      return next();
    }

    // Count overdue invoices
    const overdueInvoices = await FeeInvoice.countDocuments({
      school: req.user.school,
      status: 'unpaid',
      dueDate: { $lt: new Date() }
    });

    res.locals.alerts = {
      overdueInvoices
    };

    next();
  } catch (err) {
    console.error('Error in schoolAlerts middleware:', err);
    res.locals.alerts = {};
    next();
  }
};
