require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || "schooluser",
  password: process.env.DB_PASSWORD || "schoolpass123",
  database: process.env.DB_NAME     || "school",
};

const pool = mysql.createPool({
  host:              dbConfig.host,
  port:              dbConfig.port,
  user:              dbConfig.user,
  password:          dbConfig.password,
  database:          dbConfig.database,
  waitForConnections: true,
  connectionLimit:   10,
  queueLimit:         0,
});

console.log(`MySQL pool: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

module.exports = { pool, dbConfig };