import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listStudentsWithProgress } from "../models/teacherRepository.js";

export const teacherRouter = Router();

teacherRouter.get("/students", requireAuth, requireRole("teacher", "admin"), (req, res) => {
  const grade = req.query.grade ? Number(req.query.grade) : undefined;
  res.json({ students: listStudentsWithProgress(grade) });
});
