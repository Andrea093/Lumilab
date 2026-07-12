import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { getTopicBySlug, THEMES, THEME_ICONS, GRADE_BAND_META } from "../data/topics";

export default function TopicLesson() {
  const { slug } = useParams();
  const topic = getTopicBySlug(slug);
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress(topic ? `tema-${topic.slug}` : "tema-desconocido");
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    if (topic) markStarted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.slug]);

  if (!topic) {
    return <Navigate to="/temas" replace />;
  }

  const band = GRADE_BAND_META[topic.gradeBand] || GRADE_BAND_META["6-7"];
  const icon = THEME_ICONS[topic.theme] || "📘";
  const hasRichContent = Array.isArray(topic.content) && topic.content.length > 0;
  const fullExplanation = hasRichContent
    ? `${topic.summary} ${topic.content.join(" ")} ${topic.connection || ""}`
    : `${topic.summary} Estándar del MEN: ${topic.menStandard}`;
  const reflectionQuestion =
    topic.reflectionQuestion || `¿Qué ejemplo de tu vida diaria se relaciona con ${topic.title.toLowerCase()}?`;

  const handleReflectionAnswer = (res) => {
    setReflection(res);
    markExerciseResult(true);
    speak(`Gracias por tu reflexión: '${res}'. Sigue explorando este tema con tu profesor o profesora.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <LumiGuide text={`Hola, soy Lumi. Vamos a explorar el tema: ${topic.title}.`} />

        <nav aria-label="Miga de pan" className="text-sm text-gray-500 mt-6 mb-4">
          <Link to="/temas" className="hover:underline">
            Temas por grado
          </Link>{" "}
          / {THEMES[topic.theme] || topic.theme}
        </nav>

        {/* HERO */}
        <section className={`rounded-3xl p-6 mb-6 text-white bg-gradient-to-r ${band.header} flex items-center gap-5`}>
          <span
            className="shrink-0 w-24 h-24 rounded-full bg-white/25 flex items-center justify-center text-5xl"
            aria-hidden="true"
          >
            {icon}
          </span>
          <div>
            <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-white/25 mb-2">
              {band.icon} Grado {topic.grades.join("° y ")}° · {THEMES[topic.theme] || topic.theme}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{topic.title}</h1>
          </div>
        </section>

        <div className="space-y-6">
          {/* TEORÍA */}
          <section className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">📘</span>
              <h2 className="text-purple-700 font-bold text-xl">Teoría</h2>
            </div>

            <p className="text-gray-800 font-medium">{topic.summary}</p>

            {hasRichContent && (
              <div className="mt-4 space-y-4">
                {topic.content.map((paragraph, i) => (
                  <div key={i} className="flex gap-3">
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full ${band.top} text-white text-sm font-bold flex items-center justify-center mt-0.5`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <p className="text-gray-700">{paragraph}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-5 pt-4 border-t italic">Estándar MEN: {topic.menStandard}</p>

            <div className="flex gap-2 mt-4">
              <button className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold" onClick={() => speak(fullExplanation)}>
                Escuchar explicación completa
              </button>
              <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold" onClick={stopSpeak}>
                Parar
              </button>
            </div>
          </section>

          {/* CONEXIÓN */}
          {topic.connection && (
            <section className="bg-emerald-50 p-6 rounded-2xl shadow border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl" aria-hidden="true">🔗</span>
                <h2 className="text-emerald-800 font-bold text-xl">Conecta con lo que ya sabes</h2>
              </div>
              <p className="text-emerald-900">{topic.connection}</p>
              <button
                className="mt-3 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                onClick={() => speak(topic.connection)}
              >
                Escuchar
              </button>
            </section>
          )}

          {/* REFLEXIÓN */}
          <section className="bg-white p-6 rounded-2xl shadow border-2 border-dashed border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" aria-hidden="true">🌱</span>
              <h2 className="text-purple-700 font-bold text-xl">Reflexiona</h2>
            </div>
            <p className="text-gray-700">{reflectionQuestion}</p>

            <div className="flex gap-2 mt-3">
              <button className="bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-semibold" onClick={() => speak(reflectionQuestion)}>
                Escuchar pregunta
              </button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold" onClick={() => listen(handleReflectionAnswer)}>
                Responder por voz
              </button>
              <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold" onClick={stopSpeak}>
                Parar
              </button>
            </div>

            <p aria-live="polite" className="mt-3 font-medium text-purple-700 min-h-[1.5em]">
              {reflection && `Tu respuesta: "${reflection}"`}
            </p>
          </section>

          <Link to="/temas" className="inline-block text-violet-700 font-semibold hover:underline">
            ← Volver a temas por grado
          </Link>
        </div>
      </div>
    </div>
  );
}
