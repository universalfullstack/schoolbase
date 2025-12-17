import Subscription from "../../models/Subscription.js";
import Plan from "../../models/Plan.js";
import School from "../../models/School.js";

// List all subscriptions
export const listSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("school")
      .populate("plan")
      .sort({ createdAt: -1 })
      .lean();

    res.render("super-admin/subscriptions/list", {
      layout: "super-admin",
      title: "Subscriptions",
      subscriptions,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Unable to fetch subscriptions.");
    res.redirect("/super-admin");
  }
};

// Render create subscription form
export const createSubscriptionForm = async (req, res) => {
  try {
    const schools = await School.find({ deletedAt: null }).lean();
    const plans = await Plan.find({ isActive: true }).lean();

    res.render("super-admin/subscriptions/create", {
      layout: "super-admin",
      title: "Create Subscription",
      schools,
      plans,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Unable to load form.");
    res.redirect("/super-admin/subscriptions");
  }
};

// Handle subscription creation
export const createSubscription = async (req, res) => {
  try {
    const { school, plan, paymentMethod, payerEmail, autoRenew, notes, endDate } = req.body;

    // Validate endDate
    if (new Date(endDate) < new Date()) {
      req.flash("error_msg", "End date cannot be in the past.");
      return res.redirect("/super-admin/subscriptions/create");
    }

    const subscription = new Subscription({
      school,
      plan,
      paymentMethod,
      payerEmail,
      autoRenew: autoRenew === "on",
      notes,
      endDate,
      status: "active",
    });

    await subscription.save();
    req.flash("success_msg", "Subscription created successfully.");
    res.redirect("/super-admin/subscriptions");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", err.message || "Failed to create subscription.");
    res.redirect("/super-admin/subscriptions/create");
  }
};

// Render edit subscription form
export const editSubscriptionForm = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("school")
      .populate("plan")
      .lean();

    if (!subscription) {
      req.flash("error_msg", "Subscription not found.");
      return res.redirect("/super-admin/subscriptions");
    }

    const schools = await School.find().lean();
    const plans = await Plan.find({ isActive: true }).lean();

    res.render("super-admin/subscriptions/edit", {
      layout: "super-admin",
      title: "Edit Subscription",
      subscription,
      schools,
      plans,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Unable to load subscription.");
    res.redirect("/super-admin/subscriptions");
  }
};


// Handle subscription update
export const updateSubscription = async (req, res) => {
  try {
    const { school, plan, paymentMethod, payerEmail, autoRenew, notes, endDate } = req.body;

    // Validate endDate
    if (new Date(endDate) < new Date()) {
      req.flash("error_msg", "End date cannot be in the past.");
      return res.redirect(`/super-admin/subscriptions/edit/${req.params.id}`);
    }

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      req.flash("error_msg", "Subscription not found.");
      return res.redirect("/super-admin/subscriptions");
    }

    subscription.school = school;
    subscription.plan = plan;
    subscription.paymentMethod = paymentMethod;
    subscription.payerEmail = payerEmail;
    subscription.autoRenew = autoRenew === "on";
    subscription.notes = notes;
    subscription.endDate = endDate;

    // Status auto-update
    if (subscription.endDate < new Date() && subscription.status === "active") {
      subscription.status = "expired";
      subscription.statusHistory.push({ status: "expired" });
    } else if (subscription.status !== "active") {
      subscription.status = "active";
      subscription.statusHistory.push({ status: "active" });
    }

    await subscription.save();
    req.flash("success_msg", "Subscription updated successfully.");
    res.redirect("/super-admin/subscriptions");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", err.message || "Failed to update subscription.");
    res.redirect(`/super-admin/subscriptions/edit/${req.params.id}`);
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Subscription deleted successfully.");
    res.redirect("/super-admin/subscriptions");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to delete subscription.");
    res.redirect("/super-admin/subscriptions");
  }
};
