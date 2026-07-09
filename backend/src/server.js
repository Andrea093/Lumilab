import { app } from "./app.js";
import { env } from "./config/env.js";
import "./db/index.js";

app.listen(env.port, () => {
  console.log(`LumiLab backend escuchando en http://localhost:${env.port}`);
});
