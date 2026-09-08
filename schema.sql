-- =============================================================================
-- school-backend/schema.sql
-- =============================================================================
-- Run this file in MySQL to create the database and tables.
--
-- HOW TO RUN THIS:
--   Option 1 (command line):
--     mysql -u root -p < schema.sql
--
--   Option 2 (inside MySQL shell):
--     source /path/to/schema.sql;
--
--   Option 3 (MySQL Workbench or any GUI tool):
--     Open this file and click "Execute"
-- =============================================================================

-- Create the database (if it doesn't already exist)
CREATE DATABASE IF NOT EXISTS school;

-- Switch to the school database
USE school;

-- =============================================================================
-- Table: students
-- Stores student information.
--   id         → Auto-incrementing unique ID (primary key)
--   name       → Student's full name
--   class      → Which class/grade the student is in (e.g. "10th")
--   roll_no    → A unique roll number for the student (e.g. "101")
--   created_at → Automatically set to the current time when a row is inserted
-- =============================================================================
CREATE TABLE IF NOT EXISTS students (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  class      VARCHAR(50) NOT NULL,
  roll_no    VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Table: teachers
-- Stores teacher information.
--   id         → Auto-incrementing unique ID (primary key)
--   name       → Teacher's full name
--   subject    → The subject the teacher teaches (e.g. "Mathematics")
--   created_at → Automatically set to the current time when a row is inserted
-- =============================================================================
CREATE TABLE IF NOT EXISTS teachers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  subject    VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Table: fees
-- Stores fee payment records.
--   id              → Auto-incrementing unique ID (primary key)
--   student_roll_no → The roll number of the student who paid
--   amount          → The fee amount paid (stored as DECIMAL for money)
--   paid_at         → Automatically set to the current time when a row is inserted
-- =============================================================================
CREATE TABLE IF NOT EXISTS fees (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  student_roll_no VARCHAR(50) NOT NULL,
  amount          DECIMAL(10, 2) NOT NULL,
  paid_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Done! You can verify the tables were created by running:
--   SHOW TABLES;
--   DESCRIBE students;
--   DESCRIBE teachers;
--   DESCRIBE fees;
-- =============================================================================