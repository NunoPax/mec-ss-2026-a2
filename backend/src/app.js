const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { AppError, errorHandler, notFoundHandler } = require("./errors");

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

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
