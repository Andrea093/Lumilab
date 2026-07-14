import { db } from "../db/index.js";

export async function listPremiumTopicIds() {
  const result = await db.execute("SELECT topic_id FROM premium_topics");
  return result.rows.map((r) => r.topic_id);
}

export async function setTopicPremium(topicId, isPremium) {
  if (isPremium) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO premium_topics (topic_id) VALUES (?)",
      args: [topicId],
    });
  } else {
    await db.execute({ sql: "DELETE FROM premium_topics WHERE topic_id = ?", args: [topicId] });
  }
}

export async function hasPremiumAccess(userId) {
  const result = await db.execute({
    sql: "SELECT 1 FROM premium_access WHERE user_id = ?",
    args: [userId],
  });
  return result.rows.length > 0;
}

export async function grantPremiumAccess(userId) {
  await db.execute({
    sql: "INSERT OR IGNORE INTO premium_access (user_id) VALUES (?)",
    args: [userId],
  });
}

export async function createPayment(userId, reference, amountInCents) {
  await db.execute({
    sql: "INSERT INTO payments (user_id, reference, amount_in_cents, status) VALUES (?, ?, ?, 'PENDING')",
    args: [userId, reference, amountInCents],
  });
}

export async function updatePaymentStatus(reference, status, wompiTransactionId) {
  await db.execute({
    sql: "UPDATE payments SET status = ?, wompi_transaction_id = ?, updated_at = datetime('now') WHERE reference = ?",
    args: [status, wompiTransactionId ?? null, reference],
  });
}

export async function getPaymentByReference(reference) {
  const result = await db.execute({ sql: "SELECT * FROM payments WHERE reference = ?", args: [reference] });
  return result.rows[0];
}
