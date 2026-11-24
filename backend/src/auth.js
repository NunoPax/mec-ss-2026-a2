const { AppError } = require("./errors");

function requireAuth(req, _res, next) {
  if (!req.session || !req.session.user) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  next();
}

module.exports = { requireAuth };
