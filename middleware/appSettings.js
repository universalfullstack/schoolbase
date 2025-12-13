import AppSetting from "../models/AppSetting.js";

export default async function appSettingsMiddleware(req, res, next) {
  try {
    let settings = await AppSetting.findOne().lean();

    // Ensure single settings document exists
    if (!settings) {
      settings = await AppSetting.create({});
    }

    // Attach to request
    req.appSettings = settings;

    // Make available to all views
    res.locals.appSettings = settings;

    next();
  } catch (error) {
    console.error("App settings middleware error:", error);
    next(error);
  }
}
