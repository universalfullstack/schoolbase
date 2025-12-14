// errorHandler.js
export default function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    // Production: hide stack trace
    console.error(err); // log to console or a file for debugging
    res.status(err.status || 500).render("error", {
      message: "Something went wrong. Please try again later.",
      error: {} // empty object hides stack trace
    });
  } else {
    // Development: show full error
    res.status(err.status || 500).render("error", {
      message: err.message,
      error: err
    });
  }
}
