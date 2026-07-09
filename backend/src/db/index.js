import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { env } from "../config/env.js";

const dbPath = resolve(env.dbPath);
const dbDir = dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON;");

const migrationPath = resolve(import.meta.dirname, "migrations", "001_init.sql");
db.exec(readFileSync(migrationPath, "utf8"));
