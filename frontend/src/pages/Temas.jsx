import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GRADE_BANDS, getTopicsByGradeBand } from "../data/topics";
import LumiGuide from "../components/LumiGuide";

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

const STATUS_BADGE = {
  available: { label: "🎮 Simulador interactivo", className: "text-emerald-700 bg-emerald-100" },
  "lesson-only": { label: "📖 Lección", className: "text-indigo-700 bg-indigo-100" },
  "coming-soon": { label: "Próximamente", className: "text-gray-600 bg-gray-100" },
};

// Un bloque visual distinto por grado: color, título e ícono propios, para que
// un estudiante pueda ubicarse de un vistazo en vez de ver 20 tarjetas iguales.
const GRADE_BAND_META = {
  "6-7": {
    title: "Primeros pasos",
    subtitle: "Ideas intuitivas antes de las fórmulas",
    icon: "🌱",
    header: "from-emerald-400 to-emerald-500",
    top: "bg-emerald-400",
  },
  "8-9": {
    title: "Construyendo las bases",
    subtitle: "Leyes de Newton, energía y primeras fórmulas",
    icon: "⚙️",
    header: "from-amber-400 to-orange-500",
    top: "bg-amber-400",
  },
  "10-11": {
    title: "Física en profundidad",
    subtitle: "Cinemática, gravitación, electromagnetismo y óptica",
    icon: "🚀",
    header: "from-violet-500 to-pink-500",
    top: "bg-violet-500",
  },
};

function TopicCard({ topic, accentClass }) {
  const icon = THEME_ICONS[topic.theme] || "📘";
  const badge = STATUS_BADGE[topic.status];
  const href = topic.status === "available" ? topic.route : `/tema/${topic.slug}`;
  const disabled = topic.status === "coming-soon";

  const content = (
    <>
      <span className={`block h-1.5 rounded-full mb-4 ${accentClass}`} aria-hidden="true" />
      <div className="flex items-center justify-between mb-3">
        <span className="text-4xl" aria-hidden="true">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{topic.title}</h3>
      <p className="text-gray-600 text-sm">{topic.summary}</p>
      {!disabled && (
        <span className="inline-block mt-4 text-violet-600 font-semibold group-hover:underline">
          Entrar →
        </span>
      )}
    </>
  );

  if (disabled) {
    return (
      <div
        className="rounded-2xl p-6 bg-gradient-to-br from-gray-100 to-gray-200 border border-dashed border-gray-400"
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <Link to={href} className="group rounded-2xl p-6 bg-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition">
      {content}
    </Link>
  );
}

function GradeBandSection({ band }) {
  const meta = GRADE_BAND_META[band.id];
  const bandTopics = getTopicsByGradeBand(band.id);
  if (bandTopics.length === 0) return null;

  return (
    <section className="mb-10">
      <div className={`flex items-center gap-3 rounded-2xl p-4 mb-4 text-white bg-gradient-to-r ${meta.header}`}>
        <span className="text-3xl" aria-hidden="true">{meta.icon}</span>
        <div>
          <h2 className="font-extrabold text-lg leading-tight">
            {band.label} — {meta.title}
          </h2>
          <p className="text-sm text-white/90">{meta.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bandTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} accentClass={meta.top} />
        ))}
      </div>
    </section>
  );
}

export default function Temas() {
  const [gradeBand, setGradeBand] = useState("all");
  const visibleBands = gradeBand === "all" ? GRADE_BANDS : GRADE_BANDS.filter((b) => b.id === gradeBand);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-violet-800 mb-2">
            Temas por grado
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explora los módulos interactivos de física, de grado 6° a 11°, según los estándares del MEN.
            Cada experiencia está pensada para aprender viendo, escuchando y sintiendo.
          </p>
        </div>

        <div className="mb-8">
          <LumiGuide
            greeting="Hola, soy Lumi. Elige un grado o un tema de la lista para empezar a explorar."
            text="Hola, soy Lumi. Elige un tema para empezar."
          />
        </div>

        {/* FILTRO POR GRADO */}
        <div
          role="group"
          aria-label="Filtrar temas por grado"
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            onClick={() => setGradeBand("all")}
            aria-pressed={gradeBand === "all"}
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              gradeBand === "all" ? "bg-violet-600 text-white" : "bg-white text-gray-700 border"
            }`}
          >
            Todos
          </button>
          {GRADE_BANDS.map((band) => (
            <button
              key={band.id}
              onClick={() => setGradeBand(band.id)}
              aria-pressed={gradeBand === band.id}
              className={`px-4 py-2 rounded-full font-medium text-sm ${
                gradeBand === band.id ? "bg-violet-600 text-white" : "bg-white text-gray-700 border"
              }`}
            >
              {GRADE_BAND_META[band.id]?.icon} {band.label}
            </button>
          ))}
        </div>

        {/* BLOQUES POR GRADO */}
        {visibleBands.map((band) => (
          <GradeBandSection key={band.id} band={band} />
        ))}
      </div>
    </div>
  );
}
