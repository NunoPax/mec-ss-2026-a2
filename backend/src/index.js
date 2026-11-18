const { createApp } = require("./app");
const { getConfig } = require("./config");
const { pool } = require("./db");

const config = getConfig();
const app = createApp({ db: pool, frontendOrigin: config.frontendOrigin });
const server = app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});

let shuttingDown = false;

const shutdown = (signal) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
