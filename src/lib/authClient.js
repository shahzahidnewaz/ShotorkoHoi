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
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      ...options
    });
  } catch {
    throw new ApiError("Could not reach the ShotorkoHoi server.", 0);
  }

  let body = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch {  }
  }

  if (!res.ok) throw new ApiError(body?.error || `Request failed (${res.status})`, res.status);
  return body;
}

export function register({ name, email, password }) {
  return request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}

export function login({ email, password }) {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function changePassword({ currentPassword, newPassword, confirmPassword }) {
  return request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
  });
}

export async function updateProfile({ name, avatarUrl }) {
  const payload = {};
  if (name !== undefined) payload.name = name;
  if (avatarUrl !== undefined) payload.avatarUrl = avatarUrl;
  const result = await request("/auth/me", { method: "PATCH", body: JSON.stringify(payload) });
  return result.user;
}

export async function me() {
  const result = await request("/auth/me");
  return result.user;
}

export { ApiError };
