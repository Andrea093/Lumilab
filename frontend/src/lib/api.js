const BASE_URL = "/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error al conectar con el servidor.");
  }

  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/users/me", { token }),
  getAllProgress: (token) => request("/progress", { token }),
  getProgress: (moduleKey, token) => request(`/progress/${moduleKey}`, { token }),
  putProgress: (moduleKey, payload, token) =>
    request(`/progress/${moduleKey}`, { method: "PUT", body: payload, token }),
  getTeacherStudents: (token, grade) =>
    request(`/teacher/students${grade ? `?grade=${grade}` : ""}`, { token }),
  getAdminUsers: (token) => request("/admin/users", { token }),
  createTeacher: (token, payload) => request("/admin/users", { method: "POST", body: payload, token }),
  updateAdminUser: (token, id, payload) =>
    request(`/admin/users/${id}`, { method: "PUT", body: payload, token }),
  resetUserPassword: (token, id, newPassword) =>
    request(`/admin/users/${id}/password`, { method: "PUT", body: { newPassword }, token }),
  deleteTeacher: (token, id) => request(`/admin/users/${id}`, { method: "DELETE", token }),
};
