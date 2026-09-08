# School Backend 🗄️

A beginner-friendly **backend** REST API with MySQL.

---

## How It Works

1. You **manually** create the database and user in MySQL.
2. You put those same credentials in **`.env`**.
3. **`npm run migrate`** creates the tables.
4. **`npm start`** runs the server using those credentials.

---

## Setup

### Step 1: Make sure MySQL is running

```bash
sudo systemctl start mysql
```

### Step 2: Create database and user in MySQL

Log into MySQL as root:

```bash
sudo mysql -u root
```

Run these SQL commands:

```sql
-- Create the database
CREATE DATABASE school;

-- Create the user
CREATE USER 'schooluser'@'localhost' IDENTIFIED BY 'schoolpass123';

-- Give the user full permissions on the school database
GRANT ALL PRIVILEGES ON school.* TO 'schooluser'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SHOW GRANTS FOR 'schooluser'@'localhost';

-- Exit
EXIT;
```

**What each command does:**

| Command | What it does |
|---------|-------------|
| `CREATE DATABASE school` | Makes a new database called `school` |
| `CREATE USER 'schooluser'@'localhost' IDENTIFIED BY 'schoolpass123'` | Makes a new MySQL login with username `schooluser` and password `schoolpass123`. `localhost` means this user can only connect from the same machine. |
| `GRANT ALL PRIVILEGES ON school.* TO 'schooluser'@'localhost'` | Gives `schooluser` full permissions (SELECT, INSERT, UPDATE, DELETE, etc.) on ALL tables (`*`) in the `school` database |
| `FLUSH PRIVILEGES` | Tells MySQL to reload the permission table so changes take effect immediately |

### Step 3: Create `.env` file

Create `school-backend/.env` with the **same values** you used in Step 2:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=schooluser
DB_PASSWORD=schoolpass123
DB_NAME=school
PORT=4000
```

### Step 4: Install, build, migrate, start

```bash
cd school-backend
npm install
npm run build      # checks .env, MySQL connection, tables
npm run migrate    # creates tables
npm start          # starts the server
```

`npm run migrate` creates the tables:
- ✅ `students`
- ✅ `teachers`
- ✅ `fees`

---

## Test it

```bash
# Health check
curl http://localhost:4000

# Add a student
curl -X POST http://localhost:4000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","class":"10th","roll_no":"101"}'

# View all students
curl http://localhost:4000/api/students
```

---

## Run with PM2 (Production)

`npm start` stops the server when you close the terminal. **PM2** keeps it running in the background and restarts it automatically if it crashes.

### Install PM2 (one time, global)

```bash
npm install -g pm2
```

### Start the backend with PM2

```bash
cd school-backend
pm2 start ecosystem.config.js
```

- The app runs with the name `school-backend` (defined in `ecosystem.config.js`).
- `.env` is loaded by the app itself (dotenv), so no env vars are needed in the PM2 config.
- First time only: run `npm run migrate` once before starting PM2 so the tables exist.

### Useful PM2 commands

| Command | What it does |
|---------|-------------|
| `pm2 list` | Show all PM2 apps and status (online/stopped) |
| `pm2 logs school-backend` | Show live logs |
| `pm2 restart school-backend` | Restart the app |
| `pm2 stop school-backend` | Stop the app |
| `pm2 delete school-backend` | Remove the app from PM2's list |
| `pm2 monit` | Live CPU / memory monitor |

### Auto-start on server reboot (optional)

```bash
pm2 startup        # prints one command — copy-paste and run it
pm2 save           # saves the current app list, restores it after reboot
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/students` | Add a student `{ name, class, roll_no }` |
| POST | `/api/teachers` | Add a teacher `{ name, subject }` |
| POST | `/api/fees` | Submit a fee `{ student_roll_no, amount }` |
| GET | `/api/students` | List all students |
| GET | `/api/teachers` | List all teachers |
| GET | `/api/fees` | List all fee records |

---

## Project Structure

```
school-backend/
├── .env              ← DB credentials (same as what you created in MySQL)
├── .gitignore        ← Ignores node_modules and .env
├── package.json      ← "npm start" and "npm run migrate" scripts
├── migrate.js        ← Creates tables only (DB and user are manual)
├── server.js         ← Express API routes
├── db.js             ← MySQL connection pool (reads from .env)
├── build.js          ← Build-time checks (no .env needed)
├── ecosystem.config.js ← PM2 process config
└── README.md         ← You are here!
```

---

## MySQL User Management Quick Reference

```sql
-- See all users
SELECT user, host FROM mysql.user;

-- Check permissions for a user
SHOW GRANTS FOR 'schooluser'@'localhost';

-- Change a user's password
ALTER USER 'schooluser'@'localhost' IDENTIFIED BY 'newpassword';

-- Remove a user
DROP USER 'schooluser'@'localhost';

-- Remove all permissions
REVOKE ALL PRIVILEGES ON school.* FROM 'schooluser'@'localhost';

-- Give only SELECT and INSERT (most secure for production)
GRANT SELECT, INSERT ON school.* TO 'schooluser'@'localhost';
FLUSH PRIVILEGES;
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` | MySQL not running → `sudo systemctl start mysql` |
| `ER_ACCESS_DENIED_ERROR` during migrate | User doesn't exist or wrong password → create user in MySQL first (Step 2) |
| `ER_BAD_DB_ERROR` during migrate | Database doesn't exist → create it in MySQL first (Step 2) |
| `ER_ACCESS_DENIED_ERROR` during npm start | `.env` values don't match what you created in MySQL |
| Frontend shows "Network error" | Start backend first → `cd school-backend && npm start` |