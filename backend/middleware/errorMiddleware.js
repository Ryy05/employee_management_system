export const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  // Ensure CORS header is set
  res.setHeader("Access-Control-Allow-Origin", "*");

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "An unknown error occurred",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
