import { Router } from "express";
import { db } from "../db.js";
import { serializeReport } from "../serialize.js";
import { requireAdmin, destroyUserSessions } from "../auth.js";

const router = Router();
router.use(requireAdmin);

const VALID_STATUSES = ["pending", "approved", "rejected"];
router.get("/reports", (req, res) => {
  const status = VALID_STATUSES.includes(req.query.status) ? req.query.status : "pending";

  const rows = db.prepare(`
    SELECT reports.*, facilities.name AS facility_name, facilities.district AS facility_district
    FROM reports
    JOIN facilities ON facilities.id = reports.facility_id
    WHERE reports.status = ?
    ORDER BY reports.created_at ASC
  `).all(status);

  res.json(rows.map((row) => ({
    ...serializeReport(row),
    facilityName: row.facility_name,
    facilityDistrict: row.facility_district
  })));
});
router.get("/reports/:id", (req, res) => {
  const row = db.prepare(`
    SELECT reports.*, facilities.name AS facility_name, facilities.district AS facility_district
    FROM reports JOIN facilities ON facilities.id = reports.facility_id
    WHERE reports.id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Report not found" });
  res.json({ ...serializeReport(row), facilityName: row.facility_name, facilityDistrict: row.facility_district });
});
router.post("/reports/:id/approve", (req, res) => {
  const result = db.prepare(`
    UPDATE reports SET status = 'approved', rejection_reason = NULL, moderated_at = datetime('now')
    WHERE id = ?
  `).run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Report not found" });
  const row = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
  res.json(serializeReport(row));
});
router.post("/reports/:id/reject", (req, res) => {
  const reason = (req.body && req.body.reason) ? String(req.body.reason).trim() : null;
  const result = db.prepare(`
    UPDATE reports SET status = 'rejected', rejection_reason = ?, moderated_at = datetime('now')
    WHERE id = ?
  `).run(reason, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Report not found" });
  const row = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
  res.json(serializeReport(row));
});
router.get("/stats", (req, res) => {
  const rows = db.prepare("SELECT status, COUNT(*) AS count FROM reports GROUP BY status").all();
  const counts = { pending: 0, approved: 0, rejected: 0 };
  rows.forEach((r) => { counts[r.status] = r.count; });
  res.json(counts);
});

function serializeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    avatarUrl: row.avatar_url || null,
    createdAt: row.created_at
  };
}
router.get("/users", (req, res) => {
  const { status, role } = req.query;
  let query = "SELECT * FROM users WHERE 1 = 1";
  const params = [];
  if (status) { query += " AND status = ?"; params.push(status); }
  if (role) { query += " AND role = ?"; params.push(role); }
  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(serializeUser));
});
router.post("/users/:id/activate", (req, res) => {
  const result = db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "User not found" });
  res.json(serializeUser(db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id)));
});
router.post("/users/:id/deactivate", (req, res) => {
  if (String(req.user.id) === String(req.params.id)) {
    return res.status(400).json({ error: "You can't deactivate your own account" });
  }
  const result = db.prepare("UPDATE users SET status = 'inactive' WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "User not found" });
  destroyUserSessions(req.params.id);
  res.json(serializeUser(db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id)));
});
router.post("/users/:id/promote", (req, res) => {
  const result = db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "User not found" });
  res.json(serializeUser(db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id)));
});
router.post("/users/:id/demote", (req, res) => {
  if (String(req.user.id) === String(req.params.id)) {
    return res.status(400).json({ error: "You can't demote your own account" });
  }
  const result = db.prepare("UPDATE users SET role = 'user' WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "User not found" });
  res.json(serializeUser(db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id)));
});
router.delete("/users/:id", (req, res) => {
  if (String(req.user.id) === String(req.params.id)) {
    return res.status(400).json({ error: "You can't delete your own account" });
  }
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "User not found" });
  destroyUserSessions(req.params.id);
  res.status(204).end();
});

export default router;
