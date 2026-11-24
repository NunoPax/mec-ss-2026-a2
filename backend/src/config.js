function requiredEnv(environment, name) {
  const value = environment[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parsePort(value, name = "PORT") {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a valid TCP port`);
  }

  return port;
}

function getConfig(environment = process.env) {
  return {
    nodeEnv: environment.NODE_ENV || "development",
    port: parsePort(environment.PORT || "3000"),
    frontendOrigin: environment.FRONTEND_ORIGIN || "http://localhost:5173",
    sessionSecret: requiredEnv(environment, "SESSION_SECRET"),
    db: {
      host: requiredEnv(environment, "DB_HOST"),
      port: parsePort(environment.DB_PORT || "5432", "DB_PORT"),
      user: requiredEnv(environment, "DB_USER"),
      password: requiredEnv(environment, "DB_PASSWORD"),
      database: requiredEnv(environment, "DB_NAME"),
    },
  };
}

module.exports = { getConfig, parsePort, requiredEnv };
