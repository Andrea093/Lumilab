import { db } from "../db/index.js";

const ALL_SQL = `
  SELECT u.id, u.full_name, u.grade, u.document_id, u.email,
         mp.module_key, mp.status, mp.attempts, mp.last_score, mp.updated_at
  FROM users u
  LEFT JOIN module_progress mp ON mp.user_id = u.id
  WHERE u.role = 'student'
  ORDER BY u.grade, u.full_name
`;

const BY_GRADE_SQL = `
  SELECT u.id, u.full_name, u.grade, u.document_id, u.email,
         mp.module_key, mp.status, mp.attempts, mp.last_score, mp.updated_at
  FROM users u
  LEFT JOIN module_progress mp ON mp.user_id = u.id
  WHERE u.role = 'student' AND u.grade = ?
  ORDER BY u.full_name
`;

export async function listStudentsWithProgress(grade) {
  const result = grade
    ? await db.execute({ sql: BY_GRADE_SQL, args: [grade] })
    : await db.execute({ sql: ALL_SQL });

  const students = new Map();
  for (const row of result.rows) {
    if (!students.has(row.id)) {
      students.set(row.id, {
        id: row.id,
        fullName: row.full_name,
        grade: row.grade,
        documentId: row.document_id,
        email: row.email,
        progress: [],
      });
    }
    if (row.module_key) {
      students.get(row.id).progress.push({
        moduleKey: row.module_key,
        status: row.status,
        attempts: row.attempts,
        lastScore: row.last_score,
        updatedAt: row.updated_at,
      });
    }
  }
  return Array.from(students.values());
}
