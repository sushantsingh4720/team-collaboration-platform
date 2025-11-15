const error = (err, req, res, next) => {
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";

  // Send error response
  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = error;
