import dayjs from "dayjs";
import { Student, Staff, Guardian, SchoolAdmin } from "../../models/User.js";
import School from "../../models/School.js";
import Subscription from "../../models/Subscription.js";

export const renderSuperAdminDashboard = async (req, res) => {
  try {
    // -----------------------------
    // Fetch basic stats in parallel
    // -----------------------------
    const [
      totalSchools,
      totalStudents,
      totalGuardians,
      totalStaff,
      totalSchoolAdmins,
      subscriptionsAgg,
      latestSubscriptionsRaw
    ] = await Promise.all([
      School.countDocuments(),
      Student.countDocuments(),
      Guardian.countDocuments(),
      Staff.countDocuments(),
      SchoolAdmin.countDocuments(),
      Subscription.aggregate([
        { 
          $group: { 
            _id: null, 
            totalRevenue: { $sum: "$amountPaid" }, 
            totalActive: { $sum: 1 } 
          } 
        }
      ]),
      Subscription.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("school", "name")
        .populate("plan", "name")
        .lean()
    ]);

    const totalSubscriptions = subscriptionsAgg[0]?.totalActive || 0;
    const totalRevenue = subscriptionsAgg[0]?.totalRevenue || 0;

    // -----------------------------
    // Latest subscriptions formatting
    // -----------------------------
    const latestSubscriptions = latestSubscriptionsRaw.map(s => ({
      school: s.school?.name || "Unknown",
      plan: s.plan?.name || "N/A",
      startDate: dayjs(s.startDate).format("MMM D, YYYY"),
      endDate: dayjs(s.endDate).format("MMM D, YYYY"),
      status: s.status
    }));

    // -----------------------------
    // Subscription trend: last 6 months
    // -----------------------------
    const sixMonthsAgo = dayjs().subtract(5, "month").startOf("month").toDate();

    const trendAgg = await Subscription.aggregate([
      { $match: { startDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $dateToString: { format: "%Y-%m", date: "$startDate" } } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const trendLabelsArray = [];
    const trendDataArray = [];
    for (let i = 0; i < 6; i++) {
      const m = dayjs().subtract(5 - i, "month").format("YYYY-MM");
      trendLabelsArray.push(dayjs(m + "-01").format("MMM YYYY"));
      const found = trendAgg.find(t => t._id.month === m);
      trendDataArray.push(found ? found.count : 0);
    }

    // -----------------------------
    // Subscriptions by status summary
    // -----------------------------
    const statusAgg = await Subscription.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusLabelsArray = ["active", "expired", "pending", "cancelled"];
    const statusDataArray = statusLabelsArray.map(label => {
      const found = statusAgg.find(s => s._id === label);
      return found ? found.count : 0;
    });

    // -----------------------------
    // Render dashboard
    // -----------------------------
    res.render("super-admin/dashboard", {
      layout: "super-admin",
      title: "Dashboard",
      stats: {
        totalSchools,
        totalStaff,
        totalSchoolAdmins,
        totalStudents,
        totalSubscriptions,
        totalRevenue,
      },
      latestSubscriptions,

      // Pass JSON strings for Chart.js
      trendLabels: JSON.stringify(trendLabelsArray),
      trendData: JSON.stringify(trendDataArray),
      statusLabels: JSON.stringify(statusLabelsArray),
      statusData: JSON.stringify(statusDataArray),
    });

  } catch (err) {
    console.error("Super Admin Dashboard Error:", err);
    res.status(500).render("error", { code: "500", title: "Internal Server Error", message: "Could not load dashboard." });
  }
};
