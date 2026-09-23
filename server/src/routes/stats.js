import { Router } from "express";
import { db, STATIC } from "../db.js";
import { serializeReport } from "../serialize.js";

const router = Router();

function median(nums) {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}
router.get("/overview", (req, res) => {
  const rows = db.prepare(`SELECT * FROM reports WHERE status = 'approved'`).all();
  const reports = rows.map(serializeReport);

  const facilityRow = db.prepare("SELECT COUNT(*) AS count FROM facilities").get();
  const districtRows = db.prepare("SELECT DISTINCT district FROM facilities").all();

  if (reports.length === 0) {
    return res.json({
      totalReports: 0,
      totalFacilities: facilityRow.count,
      totalDistricts: districtRows.length,
      avgCommunication: null,
      medianWait: null,
      costRange: null,
      resolvedShare: null,
      topTags: [],
      byDistrict: [],
      byDepartment: [],
      last30Days: []
    });
  }

  const commRatings = reports.map((r) => r.communicationRating);
  const waits = reports.map((r) => r.waitMinutes);
  const costMins = reports.map((r) => r.costMin);
  const costMaxs = reports.map((r) => r.costMax);
  const resolvedCount = reports.filter((r) => r.outcome === "resolved").length;

  const tagCounts = {};
  reports.forEach((r) => r.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, label: STATIC.TAG_LABELS[tag] || tag, count }));

  const deptCounts = {};
  reports.forEach((r) => { deptCounts[r.department] = (deptCounts[r.department] || 0) + 1; });
  const byDepartment = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([department, count]) => ({ department, count }));
  const facilityDistrict = new Map(
    db.prepare("SELECT id, district FROM facilities").all().map((f) => [f.id, f.district])
  );
  const districtCounts = {};
  const districtFacilities = {};
  reports.forEach((r) => {
    const district = facilityDistrict.get(r.facilityId) || "Unknown";
    districtCounts[district] = (districtCounts[district] || 0) + 1;
    districtFacilities[district] = districtFacilities[district] || new Set();
    districtFacilities[district].add(r.facilityId);
  });
  const byDistrict = Object.entries(districtCounts)
    .map(([district, count]) => ({
      district,
      reportCount: count,
      facilityCount: districtFacilities[district].size
    }))
    .sort((a, b) => b.reportCount - a.reportCount);
  const now = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const dayCounts = Object.fromEntries(days.map((d) => [d, 0]));
  reports.forEach((r) => {
    const day = String(r.createdAt).slice(0, 10);
    if (day in dayCounts) dayCounts[day] += 1;
  });
  const last30Days = days.map((date) => ({ date, count: dayCounts[date] }));

  res.json({
    totalReports: reports.length,
    totalFacilities: facilityRow.count,
    totalDistricts: districtRows.length,
    avgCommunication: Number((commRatings.reduce((a, b) => a + b, 0) / commRatings.length).toFixed(1)),
    medianWait: median(waits),
    costRange: [Math.min(...costMins), Math.max(...costMaxs)],
    resolvedShare: Math.round((resolvedCount / reports.length) * 100),
    topTags,
    byDistrict,
    byDepartment,
    last30Days
  });
});

export default router;
