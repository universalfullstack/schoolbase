import AppSetting from "../../models/AppSetting.js";
import { uploadToCloudinary, extractPublicId, deleteFromCloudinary } from "../../utils/imageUploader.js";

export const getSettingsPage = async (req, res) => {
  try {
    res.render("super-admin/app-settings", {
      layout: "super-admin",
      title: "App Settings",
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to load settings");
    res.redirect("/super-admin/settings");
  }
};

export const updateSettings = async (req, res) => {
  try {
    // Prepare the update object
    const update = {
      general: {
        systemName: req.body.systemName,
        abbreviation: req.body.abbreviation,
        description: req.body.description,
        currency: req.body.currency,
        timezone: req.body.timezone,
      },
      contact: {
        email: req.body.contactEmail,
        phone: req.body.contactPhone,
        address: req.body.contactAddress,
      },
      branding: {
        primaryColor: req.body.primaryColor,
        secondaryColor: req.body.secondaryColor,
      },
      messaging: {
        general: {
          welcome: {
            subject: req.body.welcomeSubject,
            body: req.body.welcomeBody,
          },
        },
        account: {
          activation: {
            subject: req.body.activationSubject,
            body: req.body.activationBody,
          },
        },
        subscription: {
          expiryWarning: {
            subject: req.body.subscriptionExpirySubject,
            body: req.body.subscriptionExpiryBody,
          },
        },
      },
    };

    // Handle logo upload
    if (req.files?.logo) {
      if (req.appSettings?.branding?.logo) {
        const oldLogoId = extractPublicId(req.appSettings.branding.logo);
        await deleteFromCloudinary(oldLogoId);
      }
      update.branding.logo = await uploadToCloudinary(req.files.logo[0].path, "app-settings/logo");
    } else if (req.appSettings?.branding?.logo) {
      // Preserve existing logo if no new file uploaded
      update.branding.logo = req.appSettings.branding.logo;
    }

    // Handle favicon upload
    if (req.files?.favicon) {
      if (req.appSettings?.branding?.favicon) {
        const oldFaviconId = extractPublicId(req.appSettings.branding.favicon);
        await deleteFromCloudinary(oldFaviconId);
      }
      update.branding.favicon = await uploadToCloudinary(req.files.favicon[0].path, "app-settings/favicon");
    } else if (req.appSettings?.branding?.favicon) {
      // Preserve existing favicon if no new file uploaded
      update.branding.favicon = req.appSettings.branding.favicon;
    }

    // Update or create the settings document
    await AppSetting.findOneAndUpdate({}, update, { new: true, upsert: true });

    req.flash("success", "Settings updated successfully");
    res.redirect("/super-admin/settings");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update settings");
    res.redirect("/super-admin/settings");
  }
};
