import { db } from "../db/index.js";

export async function getProgress(userId, moduleKey) {
  const result = await db.execute({
    sql: "SELECT * FROM module_progress WHERE user_id = ? AND module_key = ?",
    args: [userId, moduleKey],
  });
  return result.rows[0];
}

export async function getAllProgress(userId) {
  const result = await db.execute({
    sql: "SELECT * FROM module_progress WHERE user_id = ? ORDER BY updated_at DESC",
    args: [userId],
  });
  return result.rows;
}

export async function upsertProgress(userId, moduleKey, { status, attempts, lastScore }) {
  const existing = await getProgress(userId, moduleKey);
  const nextStatus = status ?? existing?.status ?? "in_progress";
  const nextAttempts = attempts ?? existing?.attempts ?? 0;
  const nextScore = lastScore ?? existing?.last_score ?? null;

  await db.execute({
    sql: `INSERT INTO module_progress (user_id, module_key, status, attempts, last_score, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(user_id, module_key) DO UPDATE SET
            status = excluded.status,
            attempts = excluded.attempts,
            last_score = excluded.last_score,
            updated_at = datetime('now')`,
    args: [userId, moduleKey, nextStatus, nextAttempts, nextScore],
  });

  return getProgress(userId, moduleKey);
}
