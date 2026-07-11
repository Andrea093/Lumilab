import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { authRouter } from "./routes/auth.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { progressRouter } from "./routes/progress.routes.js";
import { teacherRouter } from "./routes/teacher.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);
app.use("/api/teacher", teacherRouter);

// Sirve el frontend ya compilado (frontend/dist) cuando existe, para desplegar
// backend y frontend como un único servicio (mismo origen, sin configurar CORS).
const frontendDist = resolve(import.meta.dirname, "../../frontend/dist");
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(resolve(frontendDist, "index.html"));
  });
}

app.use(errorHandler);
