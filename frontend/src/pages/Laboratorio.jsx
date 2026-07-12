import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { topics, THEMES } from "../data/topics";

const THEME_ICONS = {
  mediciones: "📏",
  materia: "🧪",
  fuerzas: "➡️",
  energia: "⚡",
  ondas: "🎵",
  electricidad: "🔌",
  fluidos: "💧",
  cinematica: "🚗",
  dinamica: "⚙️",
  gravitacion: "🌍",
  optica: "🔍",
  termodinamica: "🌡️",
};

const SIMULATORS = topics.filter((t) => t.status === "available");
const AVAILABLE_THEME_IDS = [...new Set(SIMULATORS.map((t) => t.theme))];

export default function Laboratorio() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SIMULATORS.filter((sim) => {
      const matchesTheme = theme === "all" || sim.theme === theme;
      const matchesQuery = !q || sim.title.toLowerCase().includes(q) || sim.summary.toLowerCase().includes(q);
      return matchesTheme && matchesQuery;
    });
  }, [query, theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ENCABEZADO */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-800 mb-2">
            🔬 Laboratorio interactivo
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explora libremente todas las simulaciones de Lumilab, sin pasar por el orden de
            grados. Busca por nombre o filtra por tema.
          </p>
        </div>

        {/* BANNER ACCESIBILIDAD */}
        <div className="bg-violet-100 border border-violet-300 rounded-2xl p-4 mb-8 text-violet-900 text-sm flex items-start gap-3">
          <span aria-hidden="true" className="text-xl">♿</span>
          <p>
            Cada simulación de esta galería <strong>se ve, se escucha y se siente</strong>: tiene
            sonido que cambia con la física real, vibración táctil y explicación por voz de Lumi.
            Están pensadas primero para estudiantes ciegos o con baja visión — y funcionan igual
            de bien para todos.
          </p>
        </div>

        {/* BUSCADOR Y FILTROS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1">
            <label htmlFor="lab-search" className="sr-only">
              Buscar simulación por nombre
            </label>
            <input
              id="lab-search"
              type="search"
              placeholder="Buscar simulación… (ej. caída, ondas, circular)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>
          <div role="group" aria-label="Filtrar por tema" className="flex flex-wrap gap-2">
            <button
              onClick={() => setTheme("all")}
              aria-pressed={theme === "all"}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                theme === "all" ? "bg-violet-600 text-white" : "bg-white text-gray-700 border"
              }`}
            >
              Todos los temas
            </button>
            {AVAILABLE_THEME_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                aria-pressed={theme === id}
                className={`px-3 py-2 rounded-full text-sm font-medium ${
                  theme === id ? "bg-violet-600 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                {THEME_ICONS[id]} {THEMES[id]}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {results.length} simulaciones encontradas.
        </p>

        {/* GRID DE SIMULADORES */}
        {results.length === 0 ? (
          <p className="text-gray-600">No encontré ninguna simulación con esa búsqueda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((sim) => (
              <Link
                key={sim.id}
                to={sim.route}
                className="group rounded-3xl p-6 bg-white shadow-md hover:shadow-xl transition flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl" aria-hidden="true">
                    {THEME_ICONS[sim.theme] || "📘"}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full text-emerald-700 bg-emerald-100">
                    Grados {sim.grades.join("° y ")}°
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">{sim.title}</h2>
                <p className="text-gray-600 text-sm flex-1">{sim.summary}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                  <span title="Tiene sonido">🔊 Sonido</span>
                  <span title="Tiene vibración">📳 Vibración</span>
                  <span title="Explicado por voz">🗣️ Voz</span>
                </div>
                <span className="inline-block mt-3 text-violet-600 font-semibold group-hover:underline">
                  Explorar →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
