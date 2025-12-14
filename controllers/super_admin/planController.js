import Plan from "../../models/Plan.js";

// List all plans
export const listPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 }).lean();
    res.render("super-admin/plans/list", {
      title: "Plans",
      layout: 'super-admin',
      plans,
      currentPath: req.originalUrl
    });
  } catch (err) {
    req.flash("error", "Failed to load plans");
    res.redirect("/super-admin");
  }
};

// Show create plan form
export const showCreatePlan = (req, res) => {
  res.render("super-admin/plans/create", {
    title: "Create Plan",
    layout: 'super-admin',
    old: {},
  });
};

// Handle create plan
export const createPlan = async (req, res) => {
  try {
    const { name, description, price, discount, billingCycle, maxStudents, maxStaff, maxClasses, maxSections, features, isActive } = req.body;

    const plan = new Plan({
      name,
      description,
      price,
      discount: discount || 0,
      billingCycle,
      maxStudents: maxStudents || 0,
      maxStaff: maxStaff || 0,
      maxClasses: maxClasses || 0,
      maxSections: maxSections || 0,
      features: features ? features.split(",").map(f => f.trim()) : [],
      isActive: isActive === "on" ? true : false,
    });

    await plan.save();
    req.flash("success", "Plan created successfully");
    res.redirect("/super-admin/plans");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create plan. Maybe a plan with this name already exists.");
    res.redirect("/super-admin/plans/create");
  }
};

// Show edit plan form
export const showEditPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) throw new Error("Plan not found");

    res.render("super-admin/plans/edit", {
      title: "Edit Plan",
      layout: 'super-admin',
      plan,
      old: {},
    });
  } catch (err) {
    req.flash("error", "Plan not found");
    res.redirect("/super-admin/plans");
  }
};

// Handle edit plan
export const editPlan = async (req, res) => {
  try {
    const { name, description, price, discount, billingCycle, maxStudents, maxStaff, maxClasses, maxSections, features, isActive } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) throw new Error("Plan not found");

    plan.name = name;
    plan.description = description;
    plan.price = price;
    plan.discount = discount || 0;
    plan.billingCycle = billingCycle;
    plan.maxStudents = maxStudents || 0;
    plan.maxStaff = maxStaff || 0;
    plan.maxClasses = maxClasses || 0;
    plan.maxSections = maxSections || 0;
    plan.features = features ? features.split(",").map(f => f.trim()) : [];
    plan.isActive = isActive === "on" ? true : false;

    await plan.save();
    req.flash("success", "Plan updated successfully");
    res.redirect("/super-admin/plans");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update plan");
    res.redirect(`/super-admin/plans/edit/${req.params.id}`);
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    req.flash("success", "Plan deleted successfully");
    res.redirect("/super-admin/plans");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete plan");
    res.redirect("/super-admin/plans");
  }
};
