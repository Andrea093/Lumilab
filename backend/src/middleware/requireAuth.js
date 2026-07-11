import { verifyToken } from "../utils/jwt.js";
import { findById, toPublicUser } from "../models/userRepository.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "No autenticado. Inicia sesion para continuar." });
  }

  try {
    const payload = verifyToken(token);
    const user = await findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Sesion invalida." });
    }
    req.user = toPublicUser(user);
    next();
  } catch {
    return res.status(401).json({ error: "Sesion invalida o expirada." });
  }
}
