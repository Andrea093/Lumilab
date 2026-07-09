import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4001,
  jwtSecret: process.env.JWT_SECRET || "lumilab-dev-secret-cambiar-en-produccion",
  dbPath: process.env.DB_PATH || "./data/lumilab.db",
};
