const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { requireAuth } = require("./auth");
const { AppError, errorHandler, notFoundHandler } = require("./errors");
const { verifyPassword } = require("./passwords");
const { createSessionMiddleware, sessionCookieName } = require("./session");
const { validateBody } = require("./validation");

const loginSchema = {
  username: { required: true, type: "string", maxLength: 32 },
  password: { required: true, type: "string", maxLength: 512 },
};

const messageSchema = {
  message: { required: true, type: "string", maxLength: 256, trim: true },
};

function regenerateSession(request) {
  return new Promise((resolve, reject) => {
    request.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function saveSession(request) {
  return new Promise((resolve, reject) => {
    request.session.save((error) => (error ? reject(error) : resolve()));
  });
}

function createApp({
  db,
  frontendOrigin = "http://localhost:5173",
  sessionSecret,
  nodeEnv = "development",
}) {
  const app = express();

  app.use(cors({ origin: frontendOrigin, credentials: true }));
  app.use(express.json({ limit: "16kb" }));
  app.use(morgan("dev"));
  app.use(createSessionMiddleware({ pool: db, secret: sessionSecret, nodeEnv }));

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

        await regenerateSession(req);
        req.session.user = { username: user.username };
        await saveSession(req);
        res.json({ username: user.username });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json(req.session.user);
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.session.destroy((error) => {
      if (error) {
        next(error);
        return;
      }

      res.clearCookie(sessionCookieName);
      res.status(204).end();
    });
  });

  app.get("/api/messages", requireAuth, async (_req, res, next) => {
    try {
      const result = await db.query(
        "SELECT message_id, author, message FROM messages ORDER BY message_id DESC"
      );
      res.json({ messages: result.rows });
    } catch (error) {
      next(error);
    }
  });

  app.post(
    "/api/messages",
    requireAuth,
    validateBody(messageSchema),
    async (req, res, next) => {
      try {
        const result = await db.query(
          `INSERT INTO messages (author, message)
           VALUES ($1, $2)
           RETURNING message_id, author, message`,
          [req.session.user.username, req.body.message.trim()]
        );
        res.status(201).json(result.rows[0]);
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
