import { db } from "../db/index.js";

const insertStmt = db.prepare(
  `INSERT INTO users (full_name, role, grade, document_id, email, password_hash)
   VALUES (?, ?, ?, ?, ?, ?)`
);

const findByEmailStmt = db.prepare("SELECT * FROM users WHERE email = ?");
const findByDocumentStmt = db.prepare("SELECT * FROM users WHERE document_id = ?");
const findByIdStmt = db.prepare("SELECT * FROM users WHERE id = ?");

export function createUser({ fullName, role = "student", grade, documentId, email, passwordHash }) {
  const info = insertStmt.run(fullName, role, grade ?? null, documentId ?? null, email ?? null, passwordHash);
  return findById(Number(info.lastInsertRowid));
}

export function findByEmail(email) {
  if (!email) return undefined;
  return findByEmailStmt.get(email);
}

export function findByDocumentId(documentId) {
  if (!documentId) return undefined;
  return findByDocumentStmt.get(documentId);
}

export function findById(id) {
  return findByIdStmt.get(id);
}

const updatePasswordAndRoleStmt = db.prepare(
  "UPDATE users SET password_hash = ?, role = ? WHERE id = ?"
);

export function updatePasswordAndRole(id, { passwordHash, role }) {
  updatePasswordAndRoleStmt.run(passwordHash, role, id);
  return findById(id);
}

export function toPublicUser(user) {
  if (!user) return null;
  const { password_hash, ...publicUser } = user;
  return publicUser;
}
