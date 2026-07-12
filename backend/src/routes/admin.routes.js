import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listAllUsers, updateUserPassword, updateUserProfile, deleteUser } from "../models/adminRepository.js";
import { createUser, findByEmail, findByDocumentId, findById, toPublicUser } from "../models/userRepository.js";
import { hashPassword } from "../utils/password.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/users", async (req, res, next) => {
  try {
    res.json({ users: await listAllUsers() });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/users", async (req, res, next) => {
  try {
    const { fullName, email, password, documentId } = req.body ?? {};
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Nombre, correo y contrasena son obligatorios." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres." });
    }
    if (await findByEmail(email)) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
    }
    if (documentId && (await findByDocumentId(documentId))) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese documento." });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      fullName,
      role: "teacher",
      documentId: documentId || null,
      email,
      passwordHash,
    });
    res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});

adminRouter.put("/users/:id", async (req, res, next) => {
  try {
    const { fullName, grade, documentId } = req.body ?? {};
    if (!fullName) {
      return res.status(400).json({ error: "El nombre es obligatorio." });
    }
    const gradeNumber = grade !== undefined && grade !== "" && grade !== null ? Number(grade) : undefined;
    if (gradeNumber !== undefined && (Number.isNaN(gradeNumber) || gradeNumber < 6 || gradeNumber > 11)) {
      return res.status(400).json({ error: "El grado debe estar entre 6 y 11." });
    }
    const user = await updateUserProfile(req.params.id, {
      fullName,
      grade: gradeNumber,
      documentId: documentId || null,
    });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});

adminRouter.put("/users/:id/password", async (req, res, next) => {
  try {
    const { newPassword } = req.body ?? {};
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "La nueva contrasena debe tener al menos 6 caracteres." });
    }
    const passwordHash = await hashPassword(newPassword);
    const user = await updateUserPassword(req.params.id, passwordHash);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete("/users/:id", async (req, res, next) => {
  try {
    const target = await findById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    if (target.role !== "teacher") {
      return res.status(400).json({ error: "Solo se pueden eliminar cuentas de docente desde aqui." });
    }
    await deleteUser(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
