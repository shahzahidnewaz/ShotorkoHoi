
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
  } catch (err) {
    throw new ApiError(
      "Could not reach the ShotorkoHoi server. Please check your connection and try again.",
      0,
      null
    );
  }

  let body = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
    }
  }

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed (${res.status})`, res.status, body);
  }

  return body;
}

let DEPARTMENTS = [];
let DISTRICTS = [];
let TAG_LABELS = {};
let metaLoadPromise = null;

async function loadMeta() {
  try {
    const [departments, districts, tags] = await Promise.all([
      request("/meta/departments"),
      request("/meta/districts"),
      request("/meta/tags")
    ]);
    DEPARTMENTS = departments || [];
    DISTRICTS = districts || [];
    TAG_LABELS = Object.fromEntries((tags || []).map((t) => [t.tag, t.label]));
  } catch (err) {
    console.error("Failed to load reference data from the API:", err);
  }
}
export function ensureMetaLoaded() {
  if (!metaLoadPromise) metaLoadPromise = loadMeta();
  return metaLoadPromise;
}
ensureMetaLoaded();

export function getDepartments() {
  return DEPARTMENTS;
}

export function getDistricts() {
  return DISTRICTS;
}

export function getTagLabel(tag) {
  return TAG_LABELS[tag] || tag;
}

export async function searchFacilities({ query = "", district = "", department = "" } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (district) params.set("district", district);
  if (department) params.set("department", department);

  const results = await request(`/facilities?${params.toString()}`);
  return results || [];
}

export async function getFacility(id) {
  try {
    return await request(`/facilities/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getReportsForFacility(id) {
  return request(`/facilities/${encodeURIComponent(id)}/reports`);
}

export function computeFacilityStats(reports) {
  if (!reports.length) return null;
  const costMins = reports.map((r) => r.costMin);
  const costMaxs = reports.map((r) => r.costMax);
  const waits = reports.map((r) => r.waitMinutes);
  const commRatings = reports.map((r) => r.communicationRating);

  const tagCounts = {};
  reports.forEach((r) => r.tags.forEach((t) => {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  }));
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return {
    reportCount: reports.length,
    costRange: [Math.min(...costMins), Math.max(...costMaxs)],
    medianWait: median(waits),
    avgCommunication: (commRatings.reduce((a, b) => a + b, 0) / commRatings.length).toFixed(1),
    topTags
  };
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export async function getDistrictSummary() {
  const districts = getDistricts();
  const results = await Promise.all(
    districts.map(async (district) => {
      const rows = await searchFacilities({ district });
      return {
        district,
        facilityCount: rows.length,
        reportCount: rows.reduce((sum, r) => sum + r.reportCount, 0)
      };
    })
  );
  return results.sort((a, b) => b.reportCount - a.reportCount);
}
export async function getPlatformStats() {
  return request("/stats/overview");
}
export async function submitReport(reportDraft) {
  const result = await request("/reports", {
    method: "POST",
    body: JSON.stringify(reportDraft)
  });
  return { success: true, status: result.status, report: result.report };
}
export async function verifyReport(id) {
  return request(`/reports/${encodeURIComponent(id)}/verify`, { method: "POST" });
}

export function fmtTaka(n, lang = "en") {
  const formatted = n.toLocaleString("en-US");
  return "৳" + (lang === "bn" ? formatted.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : formatted);
}

export { ApiError };
