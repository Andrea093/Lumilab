import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import LumiGuide from "../components/LumiGuide";
import TopicIllustration from "../components/TopicIllustration";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { getTopicBySlug, THEMES, GRADE_BAND_META } from "../data/topics";
import { normalizeAnswer } from "../utils/answer";

export default function TopicLesson() {
  const { slug } = useParams();
  const topic = getTopicBySlug(slug);
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress(topic ? `tema-${topic.slug}` : "tema-desconocido");
  const [reflection, setReflection] = useState("");
  const [reflectionResult, setReflectionResult] = useState(null); // "matched" | "engaged" | "short" | null

  useEffect(() => {
    if (topic) markStarted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.slug]);

  if (!topic) {
    return <Navigate to="/temas" replace />;
  }

  const band = GRADE_BAND_META[topic.gradeBand] || GRADE_BAND_META["6-7"];
  const hasRichContent = Array.isArray(topic.content) && topic.content.length > 0;
  const fullExplanation = hasRichContent
    ? `${topic.summary} ${topic.content.join(" ")} ${topic.connection || ""}`
    : `${topic.summary} Estándar del MEN: ${topic.menStandard}`;
  const reflectionQuestion =
    topic.reflectionQuestion || `¿Qué ejemplo de tu vida diaria se relaciona con ${topic.title.toLowerCase()}?`;

  const handleReflectionAnswer = (res) => {
    setReflection(res);
    const normalized = normalizeAnswer(res);
    const keywords = topic.reflectionKeywords || [];
    const matched = keywords.some((k) => normalized.includes(normalizeAnswer(k)));
    const wordCount = res.trim().split(/\s+/).filter(Boolean).length;

    let message;
    if (matched) {
      setReflectionResult("matched");
      message = `¡Muy bien! Tu respuesta va bien encaminada. ${topic.connection || ""}`;
    } else if (wordCount >= 3) {
      setReflectionResult("engaged");
      message = `Gracias por tu reflexión. Te cuento un poco más para completarla: ${
        topic.connection || topic.summary
      }`;
    } else {
      setReflectionResult("short");
      message = `Intenta contar un poco más. Una pista: ${topic.connection || topic.summary}`;
    }

    markExerciseResult(matched);
    speak(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <LumiGuide text={`Hola, soy Lumi. Vamos a explorar el tema: ${topic.title}.`} />

        <nav aria-label="Miga de pan" className="text-sm text-gray-500 mt-6 mb-4">
          <Link to="/temas" className="hover:underline">
            Temas por grado
          </Link>{" "}
          / {THEMES[topic.theme] || topic.theme}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* COLUMNA VISUAL */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <TopicIllustration topicId={topic.id} />
            <div className={`rounded-2xl p-4 text-white bg-gradient-to-r ${band.header}`}>
              <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-white/25 mb-2">
                {band.icon} Grado {topic.grades.join("° y ")}°
              </span>
              <h1 className="text-xl font-extrabold leading-tight">{topic.title}</h1>
              <p className="text-sm text-white/90 mt-1">{THEMES[topic.theme] || topic.theme}</p>
            </div>
          </div>

          {/* CONTENIDO */}
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

              {reflection && (
                <div aria-live="polite" className="mt-3 space-y-1">
                  <p className="font-medium text-gray-700">Tu respuesta: "{reflection}"</p>
                  {reflectionResult === "matched" && (
                    <p className="font-semibold text-emerald-700">
                      ✓ Vas bien encaminado — mencionaste la idea clave.
                    </p>
                  )}
                  {reflectionResult === "engaged" && (
                    <p className="font-semibold text-amber-700">
                      💭 Buen intento — escucha la explicación para completar la idea.
                    </p>
                  )}
                  {reflectionResult === "short" && (
                    <p className="font-semibold text-amber-700">
                      ✏️ Intenta responder con un poco más de detalle.
                    </p>
                  )}
                </div>
              )}
            </section>

            <Link to="/temas" className="inline-block text-violet-700 font-semibold hover:underline">
              ← Volver a temas por grado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
