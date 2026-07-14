import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4001,
  jwtSecret: process.env.JWT_SECRET || "lumilab-dev-secret-cambiar-en-produccion",
  dbPath: process.env.DB_PATH || "./data/lumilab.db",
  // Si se definen, la base de datos vive en Turso (libSQL remoto) y persiste entre
  // reinicios del plan free de Render. Si no, se usa un archivo SQLite local (dbPath).
  tursoUrl: process.env.TURSO_DATABASE_URL || undefined,
  tursoAuthToken: process.env.TURSO_AUTH_TOKEN || undefined,
  // Pagos (Wompi). Sin estas variables, los endpoints de pago responden "no configurado"
  // en vez de fallar de forma confusa. Usar siempre llaves de sandbox (pub_test_/prv_test_)
  // hasta confirmar que todo el flujo funciona antes de pasar a producción.
  wompiPublicKey: process.env.WOMPI_PUBLIC_KEY || undefined,
  wompiPrivateKey: process.env.WOMPI_PRIVATE_KEY || undefined,
  wompiIntegritySecret: process.env.WOMPI_INTEGRITY_SECRET || undefined,
  wompiEventsSecret: process.env.WOMPI_EVENTS_SECRET || undefined,
  // Precio de ejemplo: cambialo desde las variables de entorno de Render cuando decidas
  // el valor real, sin necesidad de tocar codigo.
  premiumPriceCop: Number(process.env.PREMIUM_PRICE_COP) || 20000,
  appUrl: process.env.APP_URL || "http://localhost:5173",
};
