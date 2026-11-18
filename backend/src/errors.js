class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, _res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || error.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(error);
  }

  const response = {
    error: {
      message: isServerError ? "Internal server error" : error.message,
    },
  };

  if (!isServerError && error.details) {
    response.error.details = error.details;
  }

  res.status(statusCode).json(response);
}

module.exports = { AppError, errorHandler, notFoundHandler };
