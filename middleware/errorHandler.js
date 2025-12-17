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
    const statusCode = err.status || 500;
    res.status(statusCode).render("errors/error", {
code: statusCode,
      title: "Server Error",
message: err.message,
      error: err
    });
  }
}
