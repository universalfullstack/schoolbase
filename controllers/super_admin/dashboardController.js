import dayjs from "dayjs";

// User models
import { Student, Staff, Guardian, SchoolAdmin } from "../../models/User.js";

// Academic models
import School from "../../models/School.js";
import Subscription from "../../models/Subscription.js";

export const renderSuperAdminDashboard = async (req, res) => {
  try {
    // -----------------------------
    // Parallel fetch for essential stats
    // -----------------------------
    const [totalSchools, totalStudents, totalGuardians, totalStaff, totalSchoolAdmins, subscriptionsAgg, latestSubscriptionsRaw] =
      await Promise.all([
        School.countDocuments(),
        Student.countDocuments(),
        Guardian.countDocuments(),
        Staff.countDocuments(),
        SchoolAdmin.countDocuments(),

        Subscription.aggregate([
          { $match: { status: "active" } },
          { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" }, totalActive: { $sum: 1 } } }
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
    // Format latest subscriptions
    // -----------------------------
    const latestSubscriptions = latestSubscriptionsRaw.map(s => ({
      school: s.school?.name || "Unknown",
      plan: s.plan?.name || "N/A",
      startDate: dayjs(s.startDate).format("MMM D, YYYY"),
      endDate: dayjs(s.endDate).format("MMM D, YYYY"),
      status: s.status
    }));

    // -----------------------------
    // Render view
    // -----------------------------
    res.render("super-admin/dashboard", {
      layout: "super-admin",
      title: "Dashboard",
      now: new Date(),

      stats: {
        totalSchools,
        totalStaff,
        totalSchoolAdmins,
        totalStudents,
        totalSubscriptions,
        totalRevenue,
      },

      latestSubscriptions
    });

  } catch (err) {
    console.error("Super Admin Dashboard Error:", err);
    res.status(500).render("error", { message: "Could not load dashboard." });
  }
};
