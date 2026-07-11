import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const GRADES = [6, 7, 8, 9, 10, 11];

const STATUS_LABELS = {
  not_started: "Sin iniciar",
  in_progress: "En curso",
  completed: "Completado",
};

function summarize(progress) {
  const counts = { completed: 0, in_progress: 0, not_started: 0 };
  progress.forEach((p) => {
    counts[p.status] = (counts[p.status] || 0) + 1;
  });
  return counts;
}

function buildCsv(students) {
  const header = ["Nombre", "Grado", "Documento", "Correo", "Módulo", "Estado", "Intentos", "Último puntaje", "Actualizado"];
  const rows = [];
  students.forEach((s) => {
    if (s.progress.length === 0) {
      rows.push([s.fullName, s.grade ?? "", s.documentId ?? "", s.email ?? "", "", "", "", "", ""]);
    } else {
      s.progress.forEach((p) => {
        rows.push([
          s.fullName,
          s.grade ?? "",
          s.documentId ?? "",
          s.email ?? "",
          p.moduleKey,
          STATUS_LABELS[p.status] || p.status,
          p.attempts ?? 0,
          p.lastScore ?? "",
          p.updatedAt ?? "",
        ]);
      });
    }
  });

  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

function downloadCsv(students) {
  const csv = buildCsv(students);
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lumilab-progreso-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function StudentRow({ student }) {
  const [expanded, setExpanded] = useState(false);
  const counts = summarize(student.progress);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-800">{student.fullName}</div>
          <div className="text-sm text-gray-500">
            {student.grade ? `${student.grade}°` : "Sin grado"} · {student.documentId || "sin documento"}
            {student.email ? ` · ${student.email}` : ""}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
            {counts.completed} completados
          </span>
          <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
            {counts.in_progress} en curso
          </span>
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold"
          >
            {expanded ? "Ocultar detalle" : "Ver detalle"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 border-t pt-3 overflow-x-auto">
          {student.progress.length === 0 ? (
            <p className="text-sm text-gray-500">Sin progreso registrado todavía.</p>
          ) : (
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pr-3 py-1">Módulo</th>
                  <th className="pr-3 py-1">Estado</th>
                  <th className="pr-3 py-1">Intentos</th>
                  <th className="pr-3 py-1">Último puntaje</th>
                </tr>
              </thead>
              <tbody>
                {student.progress.map((p) => (
                  <tr key={p.moduleKey} className="border-t">
                    <td className="pr-3 py-1">{p.moduleKey}</td>
                    <td className="pr-3 py-1">{STATUS_LABELS[p.status] || p.status}</td>
                    <td className="pr-3 py-1">{p.attempts}</td>
                    <td className="pr-3 py-1">{p.lastScore ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [grade, setGrade] = useState("all");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getTeacherStudents(token, grade === "all" ? undefined : grade)
      .then((data) => {
        if (!cancelled) setStudents(data.students || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, grade]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-800 mb-2">Panel docente</h1>
          <p className="text-gray-600">Progreso de tus estudiantes por módulo, filtrable por grado.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div role="group" aria-label="Filtrar estudiantes por grado" className="flex flex-wrap gap-2">
            <button
              onClick={() => setGrade("all")}
              aria-pressed={grade === "all"}
              className={`px-4 py-2 rounded-full font-medium text-sm ${
                grade === "all" ? "bg-violet-600 text-white" : "bg-white text-gray-700 border"
              }`}
            >
              Todos
            </button>
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                aria-pressed={grade === g}
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  grade === g ? "bg-violet-600 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                {g}°
              </button>
            ))}
          </div>

          <button
            onClick={() => downloadCsv(students)}
            disabled={students.length === 0}
            className="ml-auto px-4 py-2 rounded-xl bg-violet-700 text-white font-semibold disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>

        {loading && <p className="text-gray-600">Cargando estudiantes…</p>}
        {error && (
          <p role="alert" className="text-red-600 mb-4">
            {error}
          </p>
        )}
        {!loading && !error && students.length === 0 && (
          <p className="text-gray-600">No hay estudiantes inscritos con este filtro todavía.</p>
        )}

        <div className="space-y-3">
          {students.map((s) => (
            <StudentRow key={s.id} student={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
