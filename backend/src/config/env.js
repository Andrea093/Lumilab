import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4001,
  jwtSecret: process.env.JWT_SECRET || "lumilab-dev-secret-cambiar-en-produccion",
  dbPath: process.env.DB_PATH || "./data/lumilab.db",
  // Si se definen, la base de datos vive en Turso (libSQL remoto) y persiste entre
  // reinicios del plan free de Render. Si no, se usa un archivo SQLite local (dbPath).
  tursoUrl: process.env.TURSO_DATABASE_URL || undefined,
  tursoAuthToken: process.env.TURSO_AUTH_TOKEN || undefined,
};
