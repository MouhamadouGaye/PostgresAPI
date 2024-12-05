const Pool = require("pg").Pool;

const pool = new Pool({
  user: "XXXXXX",
  password: "XXXXXXX",
  host: "localhost",
  port: 5432,
  database: "XXXXXXX",
});

module.exports = pool;
