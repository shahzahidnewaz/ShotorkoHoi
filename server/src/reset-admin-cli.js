import { randomBytes } from "node:crypto";
import { resetAdminPassword } from "./db.js";

function parseArgs(argv) {
  const args = {};
  for (const raw of argv) {
    const match = /^--([^=]+)=(.*)$/.exec(raw);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const email = args.email || process.env.ADMIN_EMAIL || "admin@shotorko.local";
const password = args.password || randomBytes(12).toString("base64url");

const result = resetAdminPassword(email, password);

console.log("─".repeat(60));
console.log(`Admin password reset for: ${result.email}`);
console.log(`New password: "${result.password}" — log in and change it immediately.`);
console.log("─".repeat(60));