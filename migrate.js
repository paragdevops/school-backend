require("dotenv").config();
const mysql = require("mysql2/promise");

const DB_HOST     = process.env.DB_HOST     || "localhost";
const DB_PORT     = parseInt(process.env.DB_PORT) || 3306;
const DB_NAME     = process.env.DB_NAME     || "school";
const DB_USER     = process.env.DB_USER     || "schooluser";
const DB_PASSWORD = process.env.DB_PASSWORD || "schoolpass123";

const TABLES = {
  students: `
    CREATE TABLE IF NOT EXISTS students (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      class      VARCHAR(50) NOT NULL,
      roll_no    VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  teachers: `
    CREATE TABLE IF NOT EXISTS teachers (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      subject    VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  fees: `
    CREATE TABLE IF NOT EXISTS fees (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      student_roll_no VARCHAR(50) NOT NULL,
      amount          DECIMAL(10, 2) NOT NULL,
      paid_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

async function migrate() {
  let connection;

  console.log("");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║          SCHOOL DATABASE MIGRATION                       ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");

  try {
    console.log("📌 Connecting to MySQL...");
    console.log(`   Host: ${DB_HOST}:${DB_PORT}`);
    console.log(`   User: ${DB_USER}`);
    console.log(`   Database: ${DB_NAME}`);

    connection = await mysql.createConnection({
      host:     DB_HOST,
      port:     DB_PORT,
      user:     DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log("   ✅ Connected\n");

    console.log("📌 Creating tables...");

    for (const [tableName, createSQL] of Object.entries(TABLES)) {
      console.log(`   Creating table: ${tableName}...`);
      await connection.execute(createSQL);
      console.log(`   ✅ Table "${tableName}" is ready`);
    }

    console.log("");
    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║          ✅ MIGRATION COMPLETE!                          ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
    console.log("");
    console.log(`  Database : ${DB_NAME}`);
    console.log(`  Tables   : ${Object.keys(TABLES).join(", ")}`);
    console.log("");
    console.log("  Run `npm start` to start the server.");
    console.log("");

  } catch (error) {
    console.error("");
    console.error("╔══════════════════════════════════════════════════════════╗");
    console.error("║          ❌ MIGRATION FAILED!                           ║");
    console.error("╚══════════════════════════════════════════════════════════╝");
    console.error("");
    console.error("Error:", error.message);
    console.error("");

    if (error.code === "ECONNREFUSED") {
      console.error("💡 MySQL is not running. Start it:");
      console.error("   sudo systemctl start mysql");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("💡 Access denied. Did you create the user and grant permissions?");
      console.error("   Run these SQL commands first:");
      console.error("");
      console.error("   sudo mysql -u root");
      console.error("   CREATE DATABASE school;");
      console.error("   CREATE USER 'schooluser'@'localhost' IDENTIFIED BY 'schoolpass123';");
      console.error("   GRANT ALL PRIVILEGES ON school.* TO 'schooluser'@'localhost';");
      console.error("   FLUSH PRIVILEGES;");
      console.error("");
      console.error("   Then make sure your .env matches those values.");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("💡 Database does not exist. Create it first:");
      console.error("   sudo mysql -u root -e \"CREATE DATABASE school;\"");
    }

    console.error("");
    process.exit(1);

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();