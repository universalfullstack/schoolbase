import School from "../../models/School.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId
} from "../../utils/imageUploader.js";

// ============================
// LIST SCHOOLS
// ============================
export const listSchools = async (req, res) => {
  try {
    const schools = await School.find({ deletedAt: null }).lean();

    res.render("super-admin/school/list", {
      layout: "super-admin",
      title: "Schools",
      schools
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading schools");
  }
};

// ============================
// VIEW SINGLE SCHOOL
// ============================
export const viewSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate("gradingSystem subscription")
      .lean();

    if (!school) return res.status(404).send("School not found");

    res.render("super-admin/school/view", {
      layout: "super-admin",
      title: school.name,
      school
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing school");
  }
};

// ============================
// RENDER CREATE SCHOOL FORM
// ============================
export const renderCreateSchool = (req, res) => {
  res.render("super-admin/school/create", {
    layout: "super-admin",
    title: "Create School",
    old: req.session.formData || {}
  });

  req.session.formData = null; // Clear after use
};

// ============================
// CREATE SCHOOL
// ============================
export const createSchool = async (req, res) => {
  try {
    const data = {
      name: req.body.name?.trim(),
      subdomain: req.body.subdomain?.trim(),
      email: req.body.email?.trim(),
      phone: req.body.phone?.trim(),
      address: req.body.address?.trim(),
      status: req.body.status || "Active"
    };

    // PRESERVE ALL FIELDS EXCEPT SUBDOMAIN ON FAILURE
    req.session.formData = {
      ...data,
      subdomain: ""
    };

    // Validate duplicate subdomain
    const existing = await School.findOne({
      subdomain: data.subdomain,
      deletedAt: null
    });

    if (existing) {
      req.flash("error", "Subdomain already exists. Choose a different one.");
      return res.redirect("/super-admin/schools/create/new");
    }

    // Upload logo
    if (req.file) {
      data.logo = await uploadToCloudinary(req.file.path, "school-logos");
    }

    await School.create(data);

    // Clear saved form data on success
    req.session.formData = null;

    req.flash("success", "School created successfully");
    return res.redirect("/super-admin/schools");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create school: " + err.message);
    return res.redirect("/super-admin/schools/create/new");
  }
};

// ============================
// RENDER EDIT SCHOOL FORM
// ============================
export const renderEditSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).lean();
    if (!school) return res.status(404).send("School not found");

    res.render("super-admin/school/edit", {
      layout: "super-admin",
      title: `Edit ${school.name}`,
      school,
      old: req.session.formData || {}
    });

    req.session.formData = null; // Clear after use
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load school");
    res.redirect("/super-admin/schools");
  }
};

// ============================
// UPDATE SCHOOL
// ============================
export const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).send("School not found");

    const data = {
      name: req.body.name?.trim(),
      subdomain: req.body.subdomain?.trim(),
      email: req.body.email?.trim(),
      phone: req.body.phone?.trim(),
      address: req.body.address?.trim(),
      status: req.body.status || "Active"
    };

    // Preserve form values except subdomain
    req.session.formData = {
      ...data,
      subdomain: ""
    };

    // Validate duplicate subdomain except for itself
    const existing = await School.findOne({
      subdomain: data.subdomain,
      _id: { $ne: req.params.id },
      deletedAt: null
    });

    if (existing) {
      req.flash("error", "Subdomain already exists. Choose a different one.");
      return res.redirect(`/super-admin/schools/edit/${req.params.id}`);
    }

    // Apply updates
    school.name = data.name;
    school.subdomain = data.subdomain;
    school.email = data.email;
    school.phone = data.phone;
    school.address = data.address;
    school.status = data.status;

    // Logo update
    if (req.file) {
      if (school.logo) {
        const publicId = extractPublicId(school.logo);
        await deleteFromCloudinary(publicId);
      }
      school.logo = await uploadToCloudinary(req.file.path, "school-logos");
    }

    await school.save();

    req.session.formData = null; // Clear preserved data

    req.flash("success", "School updated successfully");
    return res.redirect("/super-admin/schools");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update school: " + err.message);
    return res.redirect(`/super-admin/schools/edit/${req.params.id}`);
  }
};

// ============================
// SOFT DELETE SCHOOL
// ============================
export const deleteSchool = async (req, res) => {
  try {
    await School.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date()
    });

    req.flash("success", "School deleted successfully");
    res.redirect("/super-admin/schools");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete school");
    res.redirect("/super-admin/schools");
  }
};
