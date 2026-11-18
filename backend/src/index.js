const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT || 3000);

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "ddss-database-assignment-2",
  password: process.env.DB_PASSWORD || "ddss-database-assignment-2",
  database: process.env.DB_NAME || "ddss-database-assignment-2",
});

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api", (_req, res) => {
  res.json({ service: "mec-ss-node-backend", status: "ok" });
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ service: "backend", database: "ok", status: "ok" });
  } catch (error) {
    console.error("Database health check failed", error);
    res.status(503).json({
      service: "backend",
      database: "unavailable",
      status: "error",
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

