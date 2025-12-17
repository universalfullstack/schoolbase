import express from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import { schoolAlerts } from '../middleware/schoolAlerts.js';
import {
renderSchoolAdminDashboard,
/*renderStudents,
renderStaff,
renderFees,
renderInvoices,
renderPayments,
renderSchoolProfile*/
} from '../controllers/school_admin/dashboardController.js';

const router = express.Router();

// Apply authentication and alerts middleware to all school-admin routes
router.use(ensureRole("School Admin"));
router.use(schoolAlerts);

// Dashboard
router.get('/dashboard', renderSchoolAdminDashboard);

/*
// Students
router.get('/students', renderStudents);

// Staff
router.get('/staff', renderStaff);

// Fees
router.get('/fees', renderFees);

// Invoices
router.get('/invoices', renderInvoices);

// Payments
router.get('/payments', renderPayments);

// School Profile
router.get('/school', renderSchoolProfile);
*/

export default router;