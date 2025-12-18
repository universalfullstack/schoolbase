import {
  SuperAdmin,
  SchoolAdmin,
  Staff,
  Guardian,
  Student
} from "../../models/User.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId
} from "../../utils/imageUploader.js";

/* =========================================
   ROLE → MODEL MAP
========================================= */
const ROLE_MODEL_MAP = {
  "Super Admin": SuperAdmin,
  "School Admin": SchoolAdmin,
  "Staff": Staff,
  "Guardian": Guardian,
  "Student": Student
};

/* =========================================
   ROLE → VIEW / LAYOUT / PATH MAP
========================================= */
const ROLE_CONFIG_MAP = {
  "Super Admin": {
    view: "super-admin/profile",
    layout: "super-admin",
    title: "Profile",
    redirect: "/super-admin/profile"
  },
  "School Admin": {
    view: "school-admin/profile",
    layout: "school-admin",
    title: "Profile",
    redirect: "/school-admin/profile"
  },
  "Staff": {
    view: "staff/profile",
    layout: "staff",
    title: "Profile",
    redirect: "/staff/profile"
  },
  "Guardian": {
    view: "guardian/profile",
    layout: "guardian",
    title: "Profile",
    redirect: "/guardian/profile"
  },
  "Student": {
    view: "student/profile",
    layout: "student",
    title: "Profile",
    redirect: "/student/profile"
  }
};

/* =========================================
   HELPERS
========================================= */
const getUserModel = (role) => ROLE_MODEL_MAP[role] || null;
const getRoleConfig = (role) => ROLE_CONFIG_MAP[role] || null;

/* =========================================
   RENDER PROFILE
========================================= */
export const renderProfile = (req, res) => {
  const config = getRoleConfig(req.user.role);

  if (!config) {
    return res.status(403).render("error", {
      code: "403",
      title: "Access Denied",
      message: "Invalid user role."
    });
  }

  res.render(config.view, {
    layout: config.layout,
    title: config.title,
  });
};

/* =========================================
   UPDATE PROFILE
========================================= */
export const updateProfile = async (req, res) => {
  const config = getRoleConfig(req.user.role);

  try {
    const UserModel = getUserModel(req.user.role);
    if (!UserModel || !config) {
      req.flash("error", "Invalid user role");
      return res.redirect("/profile");
    }

    const updatedData = {
      firstName: req.body.firstName,
      middleName: req.body.middleName || "",
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth || null,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email
    };

    /* ===== Profile Image Handling ===== */
    if (req.file) {
      if (req.user.profileImage?.includes("res.cloudinary.com")) {
        const publicId = extractPublicId(req.user.profileImage);
        await deleteFromCloudinary(publicId);
      }

      const folder = `profiles/${req.user._id}`;
      updatedData.profileImage = await uploadToCloudinary(
        req.file.path,
        folder
      );
    }

    await UserModel.findByIdAndUpdate(req.user._id, updatedData, {
      new: true,
      runValidators: true
    });

    req.flash("success", "Profile updated successfully");
    res.redirect(config.redirect);

  } catch (err) {
    console.error("Profile Update Error:", err);
    req.flash("error", "Could not update profile");
    res.redirect(config?.redirect || "/profile");
  }
};
