import { db } from "../db/index.js";

export async function createUser({ fullName, role = "student", grade, documentId, email, passwordHash }) {
  const result = await db.execute({
    sql: `INSERT INTO users (full_name, role, grade, document_id, email, password_hash)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [fullName, role, grade ?? null, documentId ?? null, email ?? null, passwordHash],
  });
  return findById(Number(result.lastInsertRowid));
}

export async function findByEmail(email) {
  if (!email) return undefined;
  const result = await db.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
  return result.rows[0];
}

export async function findByDocumentId(documentId) {
  if (!documentId) return undefined;
  const result = await db.execute({ sql: "SELECT * FROM users WHERE document_id = ?", args: [documentId] });
  return result.rows[0];
}

export async function findById(id) {
  const result = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [id] });
  return result.rows[0];
}

export async function updatePasswordAndRole(id, { passwordHash, role }) {
  await db.execute({
    sql: "UPDATE users SET password_hash = ?, role = ? WHERE id = ?",
    args: [passwordHash, role, id],
  });
  return findById(id);
}

export function toPublicUser(user) {
  if (!user) return null;
  const { password_hash, ...publicUser } = user;
  return publicUser;
}
