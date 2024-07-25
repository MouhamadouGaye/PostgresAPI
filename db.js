const Pool = require("pg").Pool;

const pool = new Pool({
  user: "gaye",
  password: "Postgres.2424",
  host: "localhost",
  port: 5432,
  database: "kobetodo",
});

module.exports = pool;
