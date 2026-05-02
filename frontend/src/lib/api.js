const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const { token, method = "GET", body } = options;

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = {};
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (!res.ok) {
    throw new Error(payload.message || `Request failed with status ${res.status}`);
  }

  return payload;
}
