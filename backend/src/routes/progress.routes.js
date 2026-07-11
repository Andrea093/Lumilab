import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getAllProgress, getProgress, upsertProgress } from "../models/progressRepository.js";

export const progressRouter = Router();

progressRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    res.json({ progress: await getAllProgress(req.user.id) });
  } catch (err) {
    next(err);
  }
});

progressRouter.get("/:moduleKey", requireAuth, async (req, res, next) => {
  try {
    const progress = await getProgress(req.user.id, req.params.moduleKey);
    res.json({ progress: progress ?? null });
  } catch (err) {
    next(err);
  }
});

progressRouter.put("/:moduleKey", requireAuth, async (req, res, next) => {
  try {
    const { status, attempts, lastScore } = req.body ?? {};
    const validStatuses = ["not_started", "in_progress", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado de progreso invalido." });
    }
    const progress = await upsertProgress(req.user.id, req.params.moduleKey, { status, attempts, lastScore });
    res.json({ progress });
  } catch (err) {
    next(err);
  }
});
