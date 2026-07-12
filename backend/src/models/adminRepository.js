import { db } from "../db/index.js";
import { findById } from "./userRepository.js";

export async function listAllUsers() {
  const result = await db.execute({
    sql: `SELECT id, full_name, role, grade, document_id, email, created_at
          FROM users ORDER BY role, full_name`,
  });
  return result.rows;
}

export async function updateUserPassword(id, passwordHash) {
  await db.execute({
    sql: "UPDATE users SET password_hash = ? WHERE id = ?",
    args: [passwordHash, id],
  });
  return findById(id);
}

export async function updateUserProfile(id, { fullName, grade, documentId }) {
  await db.execute({
    sql: "UPDATE users SET full_name = ?, grade = ?, document_id = ? WHERE id = ?",
    args: [fullName, grade ?? null, documentId ?? null, id],
  });
  return findById(id);
}

export async function deleteUser(id) {
  await db.execute({ sql: "DELETE FROM users WHERE id = ?", args: [id] });
}
