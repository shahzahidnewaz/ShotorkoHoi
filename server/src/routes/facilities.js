import { Router } from "express";
import { db, STATIC } from "../db.js";
import { serializeFacility, serializeReport } from "../serialize.js";

const router = Router();
router.get("/", (req, res) => {
  const { query = "", district = "", department = "" } = req.query;
  const q = `%${String(query).trim().toLowerCase()}%`;

  const rows = db.prepare(`
    SELECT facilities.*, COALESCE(counts.reportCount, 0) AS report_count
    FROM facilities
    LEFT JOIN (
      SELECT facility_id, COUNT(*) AS reportCount
      FROM reports
      WHERE status = 'approved'
      GROUP BY facility_id
    ) counts ON counts.facility_id = facilities.id
    WHERE (lower(facilities.name) LIKE @q OR lower(facilities.area) LIKE @q)
      AND (@district = '' OR facilities.district = @district)
    ORDER BY facilities.name
  `).all({ q, district });

  const withCounts = rows
    .map((row) => ({ facility: serializeFacility(row), reportCount: row.report_count }))
    .filter(({ facility }) => !department || facility.departments.includes(department));

  res.json(withCounts);
});
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM facilities WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Facility not found" });
  res.json(serializeFacility(row));
});
router.get("/:id/reports", (req, res) => {
  const facility = db.prepare("SELECT id FROM facilities WHERE id = ?").get(req.params.id);
  if (!facility) return res.status(404).json({ error: "Facility not found" });

  const rows = db.prepare(`
    SELECT * FROM reports
    WHERE facility_id = ? AND status = 'approved'
    ORDER BY created_at DESC
  `).all(req.params.id);

  res.json(rows.map(serializeReport));
});
router.get("/:id/stats", (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM reports WHERE facility_id = ? AND status = 'approved'
  `).all(req.params.id);

  if (rows.length === 0) return res.json(null);

  const reports = rows.map(serializeReport);
  const costMins = reports.map((r) => r.costMin);
  const costMaxs = reports.map((r) => r.costMax);
  const waits = reports.map((r) => r.waitMinutes).sort((a, b) => a - b);
  const commRatings = reports.map((r) => r.communicationRating);

  const tagCounts = {};
  reports.forEach((r) => r.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, label: STATIC.TAG_LABELS[tag] || tag, count }));

  const mid = Math.floor(waits.length / 2);
  const medianWait = waits.length % 2 !== 0 ? waits[mid] : Math.round((waits[mid - 1] + waits[mid]) / 2);

  res.json({
    reportCount: reports.length,
    costRange: [Math.min(...costMins), Math.max(...costMaxs)],
    medianWait,
    avgCommunication: (commRatings.reduce((a, b) => a + b, 0) / commRatings.length).toFixed(1),
    topTags
  });
});

export default router;
