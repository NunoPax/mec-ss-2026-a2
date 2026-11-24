const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");

const PgSession = connectPgSimple(session);
const sessionCookieName = "mecss.sid";

function createSessionMiddleware({ pool, secret, nodeEnv }) {
  return session({
    name: sessionCookieName,
    store: new PgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: nodeEnv === "production",
      maxAge: 60 * 60 * 1000,
    },
  });
}

module.exports = { createSessionMiddleware, sessionCookieName };
