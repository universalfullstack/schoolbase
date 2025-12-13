import AppSetting from "../models/AppSetting.js";

export const getSetting = async (key, defaultValue = null) => {
  try {
    const setting = await AppSetting.findOne({ key }).lean();
    if (!setting) return defaultValue;
    return setting.value;
  } catch (err) {
    console.error("Error loading setting:", key, err);
    return defaultValue;
  }
};
