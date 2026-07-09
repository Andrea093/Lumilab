import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getAllProgress, getProgress, upsertProgress } from "../models/progressRepository.js";

export const progressRouter = Router();

progressRouter.get("/", requireAuth, (req, res) => {
  res.json({ progress: getAllProgress(req.user.id) });
});

progressRouter.get("/:moduleKey", requireAuth, (req, res) => {
  const progress = getProgress(req.user.id, req.params.moduleKey);
  res.json({ progress: progress ?? null });
});

progressRouter.put("/:moduleKey", requireAuth, (req, res, next) => {
  try {
    const { status, attempts, lastScore } = req.body ?? {};
    const validStatuses = ["not_started", "in_progress", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado de progreso invalido." });
    }
    const progress = upsertProgress(req.user.id, req.params.moduleKey, { status, attempts, lastScore });
    res.json({ progress });
  } catch (err) {
    next(err);
  }
});
