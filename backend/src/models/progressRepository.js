import { db } from "../db/index.js";

const upsertStmt = db.prepare(`
  INSERT INTO module_progress (user_id, module_key, status, attempts, last_score, updated_at)
  VALUES (?, ?, ?, ?, ?, datetime('now'))
  ON CONFLICT(user_id, module_key) DO UPDATE SET
    status = excluded.status,
    attempts = excluded.attempts,
    last_score = excluded.last_score,
    updated_at = datetime('now')
`);

const findOneStmt = db.prepare("SELECT * FROM module_progress WHERE user_id = ? AND module_key = ?");
const findAllForUserStmt = db.prepare("SELECT * FROM module_progress WHERE user_id = ? ORDER BY updated_at DESC");

export function getProgress(userId, moduleKey) {
  return findOneStmt.get(userId, moduleKey);
}

export function getAllProgress(userId) {
  return findAllForUserStmt.all(userId);
}

export function upsertProgress(userId, moduleKey, { status, attempts, lastScore }) {
  const existing = getProgress(userId, moduleKey);
  const nextStatus = status ?? existing?.status ?? "in_progress";
  const nextAttempts = attempts ?? existing?.attempts ?? 0;
  const nextScore = lastScore ?? existing?.last_score ?? null;
  upsertStmt.run(userId, moduleKey, nextStatus, nextAttempts, nextScore);
  return getProgress(userId, moduleKey);
}
