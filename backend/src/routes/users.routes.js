import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
