// =============================================================================
// school-backend/build.js
// =============================================================================
// Build-time checks — NO .env required.
//
// In CI/CD (GitHub Actions, etc.), .env is NOT in the repo.
// Environment variables are injected at RUNTIME (by Docker, K8s, etc.).
// So this build script only checks CODE, not runtime config.
//
// What it checks:
//   ✅ All required source files exist (server.js, db.js, migrate.js)
//   ✅ All npm dependencies are installed (node_modules)
//   ✅ package.json has the required scripts
//
// What it does NOT check (that's runtime):
//   ⏭️  .env file — not needed at build time
//   ⏭️  MySQL connection — not available in CI/CD
//   ⏭️  Database/tables — created by `npm run migrate` at deploy time
// =============================================================================

const fs = require("fs");
const path = require("path");

let hasErrors = false;

console.log("");
console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║     SCHOOL BACKEND — BUILD CHECK                        ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log("");

// ── Check 1: Required source files exist ──────────────────────────────────────
console.log("📌 Checking source files...");
const requiredFiles = [
  "server.js",
  "db.js",
  "migrate.js",
  "package.json",
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.error(`   ❌ ${file} NOT found!`);
    hasErrors = true;
  }
}

// ── Check 2: node_modules exists (dependencies installed) ────────────────────
console.log("📌 Checking dependencies...");
const nodeModulesPath = path.join(__dirname, "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  console.log("   ✅ node_modules found (dependencies installed)");
} else {
  console.error("   ❌ node_modules NOT found! Run: npm install");
  hasErrors = true;
}

// ── Check 3: package.json has required scripts ────────────────────────────────
console.log("📌 Checking package.json scripts...");
const pkgPath = path.join(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const requiredScripts = ["start", "migrate", "build"];

for (const script of requiredScripts) {
  if (pkg.scripts && pkg.scripts[script]) {
    console.log(`   ✅ "npm run ${script}" → ${pkg.scripts[script]}`);
  } else {
    console.error(`   ❌ "${script}" script NOT found in package.json!`);
    hasErrors = true;
  }
}

// ── Check 4: Required npm packages are in package.json ────────────────────────
console.log("📌 Checking package.json dependencies...");
const requiredDeps = ["express", "mysql2", "cors", "dotenv"];

for (const dep of requiredDeps) {
  if (pkg.dependencies && pkg.dependencies[dep]) {
    console.log(`   ✅ ${dep}: ${pkg.dependencies[dep]}`);
  } else {
    console.error(`   ❌ ${dep} NOT found in dependencies! Run: npm install ${dep}`);
    hasErrors = true;
  }
}

// ── Note about .env ──────────────────────────────────────────────────────────
console.log("📌 Checking .env...");
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  console.log("   ✅ .env file found (will be used at runtime)");
} else {
  console.log("   ⏭️  .env file NOT found (OK for CI/CD — will be injected at runtime)");
  console.log("      For local dev, create it with your DB credentials.");
}

// ── Result ────────────────────────────────────────────────────────────────────
console.log("");
if (hasErrors) {
  console.error("╔══════════════════════════════════════════════════════════╗");
  console.error("║     ❌ BUILD FAILED — fix the errors above              ║");
  console.error("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  process.exit(1);
} else {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║     ✅ BUILD PASSED — code is ready!                    ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("  Next steps:");
  console.log("    1. npm run migrate  → create tables in DB");
  console.log("    2. npm start        → start the server");
  console.log("");
  process.exit(0);
}