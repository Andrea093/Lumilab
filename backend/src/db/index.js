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

// Sin esto, SQLite/libSQL no exige ni aplica las claves foraneas (viene apagado por
// defecto): borrar un usuario no borraria en cascada su progreso, dejando filas
// huerfanas en module_progress.
await db.execute("PRAGMA foreign_keys = ON;");

const migrationsDir = resolve(import.meta.dirname, "migrations");
const migrationFiles = ["001_init.sql", "002_premium.sql"];
for (const file of migrationFiles) {
  await db.executeMultiple(readFileSync(resolve(migrationsDir, file), "utf8"));
}
