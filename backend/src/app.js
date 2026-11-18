const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { AppError, errorHandler, notFoundHandler } = require("./errors");
const { verifyPassword } = require("./passwords");
const { validateBody } = require("./validation");

const loginSchema = {
  username: { required: true, type: "string", maxLength: 32 },
  password: { required: true, type: "string", maxLength: 512 },
};

function createApp({ db, frontendOrigin = "http://localhost:5173" }) {
  const app = express();

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json({ limit: "16kb" }));
  app.use(morgan("dev"));

  app.get("/api", (_req, res) => {
    res.json({ service: "mec-ss-node-backend", status: "ok" });
  });

  app.get("/api/health", async (_req, res, next) => {
    try {
      await db.query("SELECT 1");
      res.json({ service: "backend", database: "ok", status: "ok" });
    } catch (_error) {
      next(new AppError(503, "Database unavailable"));
    }
  });

  app.post(
    "/api/auth/login",
    validateBody(loginSchema),
    async (req, res, next) => {
      try {
        const result = await db.query(
          "SELECT username, password, salt FROM users WHERE username = $1",
          [req.body.username]
        );
        const user = result.rows[0];

        if (!user || !(await verifyPassword(req.body.password, user.password, user.salt))) {
          next(new AppError(401, "Invalid username or password"));
          return;
        }

        res.json({ username: user.username });
      } catch (error) {
        next(error);
      }
    }
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
