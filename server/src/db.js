import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { DEPARTMENTS, DISTRICTS, TAGS, TAG_LABELS, FACILITIES, REPORTS } from "./seedData.js";
import { hashPassword } from "./password.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "shotorko.sqlite");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS facilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    area TEXT NOT NULL,
    type TEXT NOT NULL,
    departments TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id TEXT NOT NULL REFERENCES facilities(id),
    department TEXT NOT NULL,
    visit_type TEXT NOT NULL,
    cost_min INTEGER NOT NULL,
    cost_max INTEGER NOT NULL,
    wait_minutes INTEGER NOT NULL,
    communication_rating INTEGER NOT NULL,
    tags TEXT NOT NULL,
    outcome TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    verification_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    moderated_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_reports_facility ON reports(facility_id);
  CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'inactive',
    avatar_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`);
const reportColumns = db.prepare("PRAGMA table_info(reports)").all().map((c) => c.name);
if (!reportColumns.includes("verification_count")) {
  db.exec("ALTER TABLE reports ADD COLUMN verification_count INTEGER NOT NULL DEFAULT 0");
}

const userColumns = db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
if (!userColumns.includes("avatar_url")) {
  db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT");
}

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM facilities").get();
  if (count > 0) return;

  const insertFacility = db.prepare(`
    INSERT INTO facilities (id, name, district, area, type, departments)
    VALUES (@id, @name, @district, @area, @type, @departments)
  `);
  const insertReport = db.prepare(`
    INSERT INTO reports
      (facility_id, department, visit_type, cost_min, cost_max, wait_minutes,
       communication_rating, tags, outcome, body, status, created_at, moderated_at)
    VALUES
      (@facilityId, @department, @visitType, @costMin, @costMax, @waitMinutes,
       @communicationRating, @tags, @outcome, @body, 'approved', @createdAt, @createdAt)
  `);

  const seedAll = db.transaction(() => {
    for (const f of FACILITIES) {
      insertFacility.run({ ...f, departments: JSON.stringify(f.departments) });
    }
    for (const r of REPORTS) {
      insertReport.run({
        facilityId: r.facilityId,
        department: r.department,
        visitType: r.visitType,
        costMin: r.costMin,
        costMax: r.costMax,
        waitMinutes: r.waitMinutes,
        communicationRating: r.communicationRating,
        tags: JSON.stringify(r.tags),
        outcome: r.outcome,
        body: r.text,
        createdAt: r.createdAt
      });
    }
  });
  seedAll();
  console.log(`Seeded ${FACILITIES.length} facilities and ${REPORTS.length} reports.`);
}

seedIfEmpty();

function writeCredentialsFile(email, password) {
  try {
    const filePath = path.join(__dirname, "..", "data", "admin-credentials.txt");
    const contents = [
      `email: ${email}`,
      `password: ${password}`,
      `generatedAt: ${new Date().toISOString()}`,
      "",
      "Delete this file after you've logged in and changed the password."
    ].join("\n");
    fs.writeFileSync(filePath, contents, { mode: 0o600 });
    console.log(`Credentials also saved to: ${filePath}`);
  } catch (err) {
    console.error("Could not write admin-credentials.txt:", err.message);
  }
}

export function resetAdminPassword(email, password) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const hash = hashPassword(password);
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

  if (existing) {
    db.prepare("UPDATE users SET password_hash = ?, role = 'admin', status = 'active' WHERE id = ?")
      .run(hash, existing.id);
  } else {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ('Admin', ?, ?, 'admin', 'active')
    `).run(normalizedEmail, hash);
  }

  writeCredentialsFile(normalizedEmail, password);
  return { email: normalizedEmail, password };
}

function bootstrapAdmin() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").get();
  if (count > 0) {
    const admins = db.prepare("SELECT email FROM users WHERE role = 'admin'").all();
    console.log("─".repeat(60));
    console.log(`Admin account(s) already exist: ${admins.map((a) => a.email).join(", ")}`);
    console.log(`Forgot the password? Run: npm run reset-admin -- --email=${admins[0].email} --password=YOUR_NEW_PASSWORD`);
    console.log("─".repeat(60));
    return;
  }

  const email = process.env.ADMIN_EMAIL || "admin@shotorko.local";
  const usingGeneratedPassword = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD || randomBytes(12).toString("base64url");

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    db.prepare("UPDATE users SET role = 'admin', status = 'active' WHERE id = ?").run(existing.id);
  } else {
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ('Admin', ?, ?, 'admin', 'active')
    `).run(email, hashPassword(password));
  }

  console.log("─".repeat(60));
  console.log(`Bootstrapped admin account: ${email}`);
  if (usingGeneratedPassword) {
    console.log(`Generated one-time password: "${password}" — log in and change it immediately.`);
    console.log(`To control this instead, set ADMIN_PASSWORD and ADMIN_EMAIL in server/.env.`);
    writeCredentialsFile(email, password);
  }
  console.log("─".repeat(60));
}

bootstrapAdmin();

function cleanupExpiredSessions() {
  try {
    const { changes } = db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run();
    if (changes > 0) console.log(`Cleaned up ${changes} expired session(s).`);
  } catch (err) {
    console.error("Session cleanup failed:", err);
  }
}
cleanupExpiredSessions();
const SESSION_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const cleanupTimer = setInterval(cleanupExpiredSessions, SESSION_CLEANUP_INTERVAL_MS);
cleanupTimer.unref?.();

export const STATIC = { DEPARTMENTS, DISTRICTS, TAGS, TAG_LABELS };