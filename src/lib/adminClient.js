const API_BASE = import.meta.env.VITE_API_BASE || "/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}/admin${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...options
    });
  } catch {
    throw new ApiError("Could not reach the ShotorkoHoi server.", 0);
  }

  if (res.status === 204) return null;

  let body = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch {  }
  }

  if (!res.ok) throw new ApiError(body?.error || `Request failed (${res.status})`, res.status);
  return body;
}
export const listReports = (status = "pending") => request(`/reports?status=${status}`);
export const approveReport = (id) => request(`/reports/${id}/approve`, { method: "POST" });
export const rejectReport = (id, reason) =>
  request(`/reports/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
export const getStats = () => request("/stats");
export const listUsers = () => request("/users");
export const activateUser = (id) => request(`/users/${id}/activate`, { method: "POST" });
export const deactivateUser = (id) => request(`/users/${id}/deactivate`, { method: "POST" });
export const promoteUser = (id) => request(`/users/${id}/promote`, { method: "POST" });
export const demoteUser = (id) => request(`/users/${id}/demote`, { method: "POST" });
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });

export { ApiError };
