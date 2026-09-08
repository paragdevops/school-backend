require("dotenv").config();

const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.log("");
  console.log("⚠️  No .env file found. Using default values or runtime env vars.");
  console.log("   For local dev, create .env with your DB credentials.");
  console.log("");
}

const express = require("express");
const cors    = require("cors");
const { pool } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({ status: "Backend running", message: "The school backend API is up and running!" });
});

app.post("/api/students", async (req, res) => {
  try {
    const { name, class: studentClass, roll_no } = req.body;

    if (!name || !studentClass || !roll_no) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide: name, class, and roll_no",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO students (name, class, roll_no) VALUES (?, ?, ?)",
      [name, studentClass, roll_no]
    );

    res.status(201).json({
      message: `Student "${name}" added successfully!`,
      id: result.insertId,
    });

  } catch (error) {
    console.error("Error inserting student:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
});

app.post("/api/teachers", async (req, res) => {
  try {
    const { name, subject } = req.body;

    if (!name || !subject) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide: name and subject",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO teachers (name, subject) VALUES (?, ?)",
      [name, subject]
    );

    res.status(201).json({
      message: `Teacher "${name}" added successfully!`,
      id: result.insertId,
    });

  } catch (error) {
    console.error("Error inserting teacher:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
});

app.post("/api/fees", async (req, res) => {
  try {
    const { student_roll_no, amount } = req.body;

    if (!student_roll_no || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide: student_roll_no and amount",
      });
    }

    const feeAmount = parseFloat(amount);
    if (isNaN(feeAmount) || feeAmount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be a positive number",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO fees (student_roll_no, amount) VALUES (?, ?)",
      [student_roll_no, feeAmount]
    );

    res.status(201).json({
      message: `Fee of ₹${feeAmount} submitted for roll number ${student_roll_no}!`,
      id: result.insertId,
    });

  } catch (error) {
    console.error("Error inserting fee:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM students ORDER BY id DESC");
    res.json({ count: rows.length, students: rows });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
});

app.get("/api/teachers", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM teachers ORDER BY id DESC");
    res.json({ count: rows.length, teachers: rows });
  } catch (error) {
    console.error("Error fetching teachers:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
});

app.get("/api/fees", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM fees ORDER BY id DESC");
    res.json({ count: rows.length, fees: rows });
  } catch (error) {
    console.error("Error fetching fees:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("=============================================");
  console.log("  School Backend API Server");
  console.log("=============================================");
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log("=============================================");
  console.log("  API Endpoints:");
  console.log(`    GET  /                  → Health check`);
  console.log(`    POST /api/students     → Add a student`);
  console.log(`    POST /api/teachers     → Add a teacher`);
  console.log(`    POST /api/fees         → Submit a fee`);
  console.log(`    GET  /api/students     → List all students`);
  console.log(`    GET  /api/teachers     → List all teachers`);
  console.log(`    GET  /api/fees         → List all fees`);
  console.log("=============================================");
});