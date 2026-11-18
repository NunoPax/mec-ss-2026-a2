const crypto = require("node:crypto");
const { promisify } = require("node:util");

const deriveKey = promisify(crypto.scrypt);
const keyLength = 64;

async function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derivedKey = await deriveKey(password, salt, keyLength);

  return {
    password: derivedKey.toString("hex"),
    salt,
  };
}

async function verifyPassword(password, storedPassword, salt) {
  try {
    const derivedKey = await deriveKey(password, salt, keyLength);
    const storedKey = Buffer.from(storedPassword, "hex");

    return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey);
  } catch (_error) {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
