const { hashPassword } = require("../src/passwords");
const { pool } = require("../src/db");

const username = process.env.SEED_USERNAME || "estudante";
const plainPassword = process.env.SEED_PASSWORD || "password123";

async function seedUser() {
  const { password, salt } = await hashPassword(plainPassword);
  const result = await pool.query(
    `INSERT INTO users (username, password, salt)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    [username, password, salt]
  );

  if (result.rowCount === 0) {
    console.log(`User ${username} already exists`);
  } else {
    console.log(`Seeded user ${username}`);
  }
}

seedUser()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
