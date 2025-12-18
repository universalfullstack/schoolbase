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
   ROLE → LAYOUT / REDIRECT MAP
========================================= */
const ROLE_CONFIG_MAP = {
  "Super Admin": {
    layout: "super-admin",
    redirect: "/super-admin/profile"
  },
  "School Admin": {
    layout: "school-admin",
    redirect: "/school-admin/profile"
  },
  "Staff": {
    layout: "staff",
    redirect: "/staff/profile"
  },
  "Guardian": {
    layout: "guardian",
    redirect: "/guardian/profile"
  },
  "Student": {
    layout: "student",
    redirect: "/student/profile"
  }
};

/* =========================================
   HELPERS
========================================= */
const getUserModel = (role) => ROLE_MODEL_MAP[role] || null;
const getRoleConfig = (role) => ROLE_CONFIG_MAP[role] || null;

/* =========================================
   RENDER PROFILE (SINGLE VIEW)
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

  res.render("user/profile", {
    layout: config.layout,
    title: "My Profile",
    user: req.user
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
