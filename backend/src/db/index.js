import { createClient } from "@libsql/client";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { env } from "../config/env.js";

// En producción (Render free, sin disco persistente) se usa Turso, una base de datos
// libSQL remota con capa gratuita persistente. En desarrollo local, sin variables de
// Turso configuradas, se usa un archivo SQLite local igual que antes.
let clientConfig;
if (env.tursoUrl) {
  clientConfig = { url: env.tursoUrl, authToken: env.tursoAuthToken };
} else {
  const dbPath = resolve(env.dbPath);
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
  clientConfig = { url: `file:${dbPath}` };
}

export const db = createClient(clientConfig);

const migrationPath = resolve(import.meta.dirname, "migrations", "001_init.sql");
await db.executeMultiple(readFileSync(migrationPath, "utf8"));
