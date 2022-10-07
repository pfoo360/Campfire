const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: process.env.DB_WAIT_FOR,
  connectionLimit: process.env.DB_CONN_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT,
});

module.exports = pool.promise();
