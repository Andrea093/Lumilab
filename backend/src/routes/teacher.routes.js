import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listStudentsWithProgress } from "../models/teacherRepository.js";

export const teacherRouter = Router();

teacherRouter.get("/students", requireAuth, requireRole("teacher", "admin"), async (req, res, next) => {
  try {
    const grade = req.query.grade ? Number(req.query.grade) : undefined;
    res.json({ students: await listStudentsWithProgress(grade) });
  } catch (err) {
    next(err);
  }
});
