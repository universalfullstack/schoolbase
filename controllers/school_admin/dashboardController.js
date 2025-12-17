import dayjs from "dayjs";
import { Student, Staff, Guardian } from "../../models/User.js";
import FeePayment from "../../models/FeePayment.js";
import FeeInvoice from "../../models/FeeInvoice.js";

export const renderSchoolAdminDashboard = async (req, res) => {
  try {
    const schoolId = req.user.school || req.user.schools?.[0];

    if (!schoolId) {
      return res.status(403).render("error", {
        title: "403 error",
        message: "No school assigned to this admin.",
       backUrl: "/"
      });
    }

    /* ===============================
       BASIC SCHOOL STATISTICS
    ================================ */
    const [
      totalStudents,
      totalStaff,
      totalGuardians,
      totalInvoices,
      revenueAgg,
      latestPaymentsRaw
    ] = await Promise.all([
      Student.countDocuments({ school: schoolId }),
      Staff.countDocuments({ school: schoolId }),
      Guardian.countDocuments({ school: schoolId }),
      FeeInvoice.countDocuments({ school: schoolId }),

      // Total revenue
      FeePayment.aggregate([
        { $match: { school: schoolId, status: "paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amountPaid" }
          }
        }
      ]),

      // Latest payments
      FeePayment.find({ school: schoolId })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("student", "firstName lastName")
        .populate("invoice", "invoiceNumber")
        .lean()
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    /* ===============================
       FORMAT LATEST PAYMENTS
    ================================ */
    const latestPayments = latestPaymentsRaw.map(p => ({
      student: p.student
        ? `${p.student.firstName} ${p.student.lastName}`
        : "Unknown",
      invoice: p.invoice?.invoiceNumber || "N/A",
      amount: p.amountPaid,
      date: dayjs(p.createdAt).format("MMM D, YYYY"),
      method: p.paymentMethod
    }));

    /* ===============================
       REVENUE TREND (LAST 6 MONTHS)
    ================================ */
    const sixMonthsAgo = dayjs()
      .subtract(5, "month")
      .startOf("month")
      .toDate();

    const revenueTrendAgg = await FeePayment.aggregate([
      {
        $match: {
          school: schoolId,
          status: "paid",
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" }
            }
          },
          total: { $sum: "$amountPaid" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const trendLabels = [];
    const trendData = [];

    for (let i = 0; i < 6; i++) {
      const monthKey = dayjs()
        .subtract(5 - i, "month")
        .format("YYYY-MM");

      trendLabels.push(dayjs(monthKey + "-01").format("MMM YYYY"));

      const found = revenueTrendAgg.find(r => r._id.month === monthKey);
      trendData.push(found ? found.total : 0);
    }

    /* ===============================
       RENDER DASHBOARD
    ================================ */
    res.render("school-admin/dashboard", {
      layout: "school-admin",
      title: "Dashboard",

      stats: {
        totalStudents,
        totalStaff,
        totalGuardians,
        totalInvoices,
        totalRevenue
      },

      latestPayments,

      trendLabels: JSON.stringify(trendLabels),
      trendData: JSON.stringify(trendData)
    });

  } catch (err) {
    console.error("School Admin Dashboard Error:", err);
    res.status(500).render("error", {
      message: "Could not load dashboard."
    });
  }
};
