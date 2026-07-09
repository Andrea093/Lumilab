import { useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

// Sincroniza el progreso de un módulo (iniciado / en curso / completado) con el backend.
export default function useModuleProgress(moduleKey) {
  const { token, isAuthenticated } = useAuth();
  const attemptsRef = useRef(0);

  const save = useCallback(
    (payload) => {
      if (!isAuthenticated || !token) return;
      api.putProgress(moduleKey, payload, token).catch(() => {
        // si falla el guardado de progreso no se interrumpe la experiencia del estudiante
      });
    },
    [moduleKey, token, isAuthenticated]
  );

  const markStarted = useCallback(() => {
    save({ status: "in_progress", attempts: attemptsRef.current });
  }, [save]);

  const markExerciseResult = useCallback(
    (correct) => {
      attemptsRef.current += 1;
      save({ status: "in_progress", attempts: attemptsRef.current, lastScore: correct ? 100 : 0 });
    },
    [save]
  );

  const markCompleted = useCallback(() => {
    save({ status: "completed", attempts: attemptsRef.current });
  }, [save]);

  return { markStarted, markExerciseResult, markCompleted };
}
