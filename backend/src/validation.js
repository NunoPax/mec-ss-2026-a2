const { AppError } = require("./errors");

function validateBody(schema) {
  return (req, _res, next) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const fields = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (value === undefined || value === null || value === "")) {
        fields[field] = "is required";
        continue;
      }

      if (value === undefined || value === null) {
        continue;
      }

      if (rules.type && typeof value !== rules.type) {
        fields[field] = `must be a ${rules.type}`;
        continue;
      }

      if (rules.trim && typeof value === "string" && value.trim() === "") {
        fields[field] = "must not be blank";
        continue;
      }

      if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
        fields[field] = `must be at most ${rules.maxLength} characters`;
      }
    }

    if (Object.keys(fields).length > 0) {
      next(new AppError(400, "Validation failed", { fields }));
      return;
    }

    next();
  };
}

module.exports = { validateBody };
