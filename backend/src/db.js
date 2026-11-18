const { Pool } = require("pg");
const { getConfig } = require("./config");

const pool = new Pool(getConfig().db);

module.exports = { pool };
