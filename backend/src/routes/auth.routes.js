import { Router } from "express";
import { createUser, findByEmail, findByDocumentId, toPublicUser } from "../models/userRepository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { fullName, grade, documentId, email, password } = req.body ?? {};

    if (!fullName || !documentId || !password) {
      return res.status(400).json({ error: "Nombre, documento y contrasena son obligatorios." });
    }

    const gradeNumber = grade !== undefined && grade !== "" ? Number(grade) : undefined;
    if (gradeNumber !== undefined && (Number.isNaN(gradeNumber) || gradeNumber < 6 || gradeNumber > 11)) {
      return res.status(400).json({ error: "El grado debe estar entre 6 y 11." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres." });
    }

    if (findByDocumentId(documentId)) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese documento." });
    }
    if (email && findByEmail(email)) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
    }

    const passwordHash = await hashPassword(password);
    const user = createUser({
      fullName,
      grade: gradeNumber,
      documentId,
      email: email || null,
      passwordHash,
    });

    const token = signToken({ sub: user.id });
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body ?? {};
    if (!identifier || !password) {
      return res.status(400).json({ error: "Documento/correo y contrasena son obligatorios." });
    }

    const user = findByEmail(identifier) || findByDocumentId(identifier);
    if (!user) {
      return res.status(401).json({ error: "Credenciales invalidas." });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales invalidas." });
    }

    const token = signToken({ sub: user.id });
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});
