import { Router } from "express";
import { db, STATIC } from "../db.js";
import { serializeReport } from "../serialize.js";
import { rateLimit } from "../rateLimit.js";

const router = Router();

const REQUIRED_FIELDS = [
  "facilityId", "department", "visitType", "waitMinutes",
  "communicationRating", "outcome", "text"
];
const MAX_LENGTHS = { department: 200, visitType: 200, text: 1200 };

const submitLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, name: "report-submit" });
const verifyLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60, name: "report-verify" });
router.post("/", submitLimiter, (req, res) => {
  const body = req.body || {};

  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === null || body[f] === "");
  if (missing.length) {
    return res.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (String(body[field]).length > max) {
      return res.status(400).json({ error: `${field} must be ${max} characters or fewer` });
    }
  }

  const facility = db.prepare("SELECT id FROM facilities WHERE id = ?").get(body.facilityId);
  if (!facility) return res.status(400).json({ error: "Unknown facility" });

  if (!["resolved", "unresolved"].includes(body.outcome)) {
    return res.status(400).json({ error: "outcome must be 'resolved' or 'unresolved'" });
  }

  const communicationRating = Number(body.communicationRating);
  if (!Number.isInteger(communicationRating) || communicationRating < 1 || communicationRating > 5) {
    return res.status(400).json({ error: "communicationRating must be an integer 1–5" });
  }

  const trimmedText = String(body.text).trim();
  if (trimmedText.length < 30) {
    return res.status(400).json({ error: "text must be at least 30 characters" });
  }

  const tags = Array.isArray(body.tags) ? body.tags.filter((t) => STATIC.TAGS.includes(t)) : [];
  const MAX_AMOUNT = 100_000_000;
  const costMin = Number.isFinite(Number(body.costMin)) ? Math.min(MAX_AMOUNT, Math.max(0, Number(body.costMin))) : 0;
  const costMax = Number.isFinite(Number(body.costMax)) ? Math.min(MAX_AMOUNT, Math.max(costMin, Number(body.costMax))) : costMin;
  const waitMinutes = Math.max(0, Math.min(100000, Number(body.waitMinutes) || 0));

  const info = db.prepare(`
    INSERT INTO reports
      (facility_id, department, visit_type, cost_min, cost_max, wait_minutes,
       communication_rating, tags, outcome, body, status)
    VALUES
      (@facilityId, @department, @visitType, @costMin, @costMax, @waitMinutes,
       @communicationRating, @tags, @outcome, @text, 'pending')
  `).run({
    facilityId: body.facilityId,
    department: String(body.department).trim(),
    visitType: String(body.visitType).trim(),
    costMin,
    costMax,
    waitMinutes,
    communicationRating,
    tags: JSON.stringify(tags),
    outcome: body.outcome,
    text: trimmedText
  });

  const row = db.prepare("SELECT * FROM reports WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ success: true, status: "pending_review", report: serializeReport(row) });
});
router.post("/:id/verify", verifyLimiter, (req, res) => {
  const row = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Report not found" });
  if (row.status !== "approved") {
    return res.status(400).json({ error: "Only published reports can be verified" });
  }

  db.prepare("UPDATE reports SET verification_count = verification_count + 1 WHERE id = ?").run(req.params.id);
  const updated = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
  res.json(serializeReport(updated));
});

export default router;
