import { Router } from "express";
import { db } from "../db.js";
import { hashPassword, verifyPassword } from "../password.js";
import { createSession, destroySession, getSessionUser, requireAuth, publicUser } from "../auth.js";
import { rateLimit } from "../rateLimit.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_DATA_URL_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-zA-Z0-9+/]+=*$/;
const MAX_AVATAR_LENGTH = 400_000;

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, name: "login" });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, name: "register" });
const changePasswordLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, name: "change-password" });
const updateProfileLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, name: "update-profile" });
router.post("/register", registerLimiter, (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !String(name).trim()) return res.status(400).json({ error: "Name is required" });
  if (String(name).trim().length > 200) return res.status(400).json({ error: "Name is too long" });
  if (!email || !EMAIL_RE.test(String(email).trim())) return res.status(400).json({ error: "A valid email is required" });
  if (String(email).trim().length > 254) return res.status(400).json({ error: "Email is too long" });
  if (!password || String(password).length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
  if (String(password).length > 200) return res.status(400).json({ error: "Password is too long" });

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);
  if (existing) return res.status(409).json({ error: "An account with that email already exists" });

  const info = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, status)
    VALUES (?, ?, ?, 'user', 'inactive')
  `).run(String(name).trim(), normalizedEmail, hashPassword(password));

  res.status(201).json({
    success: true,
    message: "Account created. An admin needs to activate it before you can log in."
  });
  void info;
});
router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const normalizedEmail = String(email).trim().toLowerCase();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail);

  if (!row || !verifyPassword(password, row.password_hash)) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }
  if (row.status !== "active") {
    return res.status(403).json({ error: "This account hasn't been activated yet. Please wait for an admin to approve it." });
  }

  createSession(req, res, row.id);
  res.json(publicUser(row));
});
router.post("/logout", (req, res) => {
  destroySession(req, res);
  res.json({ success: true });
});
router.post("/change-password", requireAuth, changePasswordLimiter, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "All three fields are required" });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }
  if (String(newPassword).length > 200) {
    return res.status(400).json({ error: "New password is too long" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "New password and confirmation do not match" });
  }

  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!row || !verifyPassword(currentPassword, row.password_hash)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  if (verifyPassword(newPassword, row.password_hash)) {
    return res.status(400).json({ error: "New password must be different from the current password" });
  }

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), req.user.id);
  res.json({ success: true });
});
router.patch("/me", requireAuth, updateProfileLimiter, (req, res) => {
  const { name, avatarUrl } = req.body || {};
  const updates = [];
  const params = [];

  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (!trimmed) return res.status(400).json({ error: "Name is required" });
    if (trimmed.length > 200) return res.status(400).json({ error: "Name is too long" });
    updates.push("name = ?");
    params.push(trimmed);
  }

  if (avatarUrl !== undefined) {
    if (avatarUrl === null || avatarUrl === "") {
      updates.push("avatar_url = ?");
      params.push(null);
    } else {
      if (String(avatarUrl).length > MAX_AVATAR_LENGTH) {
        return res.status(400).json({ error: "Image is too large. Please use an image under 300KB." });
      }
      if (!AVATAR_DATA_URL_RE.test(String(avatarUrl))) {
        return res.status(400).json({ error: "Image must be a PNG, JPEG, WEBP, or GIF file" });
      }
      updates.push("avatar_url = ?");
      params.push(avatarUrl);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: "Nothing to update" });

  params.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json({ user: publicUser(row) });
});
router.get("/me", (req, res) => {
  const user = getSessionUser(req);
  res.json({ user });
});

export default router;
export { requireAuth };
