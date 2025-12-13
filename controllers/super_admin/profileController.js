import { SuperAdmin, SchoolAdmin, Staff, Guardian, Student } from "../../models/User.js";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "../../utils/imageUploader.js";

const getUserModel = (role) => ({
  "Super Admin": SuperAdmin,
  "School Admin": SchoolAdmin,
  "Staff": Staff,
  "Guardian": Guardian,
  "Student": Student,
}[role] || null);

export const renderSuperAdminProfile = (req, res) => {
  res.render("super-admin/profile", {
    layout: "super-admin",
    title: "Super Admin Profile"
  });
};

export const updateProfile = async (req, res) => {
  try {
    const UserModel = getUserModel(req.user.role);
    if (!UserModel) return res.status(400).send("Invalid user role");

    const updatedData = {
      firstName: req.body.firstName,
      middleName: req.body.middleName || "",
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth || null,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
    };

    if (req.file) {
      // Delete old image only if it's a Cloudinary URL
      if (req.user.profileImage?.includes("res.cloudinary.com")) {
        const publicId = extractPublicId(req.user.profileImage);
        await deleteFromCloudinary(publicId);
      }

      // Upload new image to Cloudinary
      const folder = `profiles/${req.user._id}`;
      updatedData.profileImage = await uploadToCloudinary(req.file.path, folder);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    );

    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");
  } catch (err) {
    console.error("Profile Update Error:", err);
    req.flash("error", "Could not update profile");
    res.redirect("/profile");
  }
};
