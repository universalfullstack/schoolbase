import mongoose from "mongoose";

const appSettingSchema = new mongoose.Schema(
  {
    general: {
      systemName: { type: String, required: true, default: "My School System" },
      abbreviation: { type: String, default: "MSS" },
      description: { type: String, default: "This is the default school management system." },
      currency: { type: String, default: "NGN" },
      timezone: { type: String, default: "Africa/Lagos" },
    },
    contact: {
      email: { type: String, default: "support@myschool.com" },
      phone: { type: String, default: "+234 000 0000" },
      address: { type: String, default: "123 School St, Lagos, Nigeria" },
    },
    branding: {
      logo: { type: String, default: "/images/default-logo.png" },      // URL or path to default logo
      favicon: { type: String, default: "/images/default-favicon.png" }, // URL or path to default favicon
      primaryColor: { type: String, default: "#0d6efd" },               // Bootstrap primary blue
      secondaryColor: { type: String, default: "#6c757d" },             // Bootstrap secondary gray
    },
    messaging: {
      general: {
        welcome: {
          subject: { type: String, default: "Welcome to {{systemName}}" },
          body: { type: String, default: "Hello {{firstName}}, welcome to {{systemName}}!" },
        },
      },
      account: {
        activation: {
          subject: { type: String, default: "Activate Your Account" },
          body: { type: String, default: "Please activate your account by clicking the link." },
        },
      },
      subscription: {
        expiryWarning: {
          subject: { type: String, default: "Subscription Expiry Warning" },
          body: { type: String, default: "Your subscription will expire soon. Renew to continue services." },
        },
      },
    },
  },
  { timestamps: true }
);

// Export model
const AppSetting = mongoose.model("AppSetting", appSettingSchema);

export default AppSetting;
