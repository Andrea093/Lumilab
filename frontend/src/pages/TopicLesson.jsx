import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { getTopicBySlug, THEMES } from "../data/topics";

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
    <div className="p-6 text-lg max-w-4xl mx-auto">
      <LumiGuide text={`Hola, soy Lumi. Vamos a explorar el tema: ${topic.title}.`} />

      <div className="mt-6 space-y-6">
        <nav aria-label="Miga de pan" className="text-sm text-gray-500">
          <Link to="/temas" className="hover:underline">
            Temas por grado
          </Link>{" "}
          / {THEMES[topic.theme] || topic.theme}
        </nav>

        <section className="bg-white p-5 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-violet-800 mb-1">{topic.title}</h1>
          <p className="text-sm text-gray-500 mb-3">
            Grado {topic.grades.join("° y ")}° · {THEMES[topic.theme] || topic.theme}
          </p>

          <p className="text-gray-800 font-medium">{topic.summary}</p>

          {hasRichContent && (
            <div className="mt-4 space-y-3 text-gray-700">
              {topic.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4 italic">Estándar MEN: {topic.menStandard}</p>

          <div className="flex gap-2 mt-4">
            <button className="bg-purple-600 text-white px-3 py-2 rounded" onClick={() => speak(fullExplanation)}>
              Escuchar explicación completa
            </button>
            <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>
              Parar
            </button>
          </div>
        </section>

        {topic.connection && (
          <section className="bg-white p-5 rounded-xl shadow border-l-4 border-emerald-400">
            <h2 className="text-emerald-700 font-bold text-lg">🔗 Conecta con lo que ya sabes</h2>
            <p className="text-gray-700 mt-2">{topic.connection}</p>
            <button
              className="mt-3 bg-emerald-600 text-white px-3 py-2 rounded text-sm"
              onClick={() => speak(topic.connection)}
            >
              Escuchar
            </button>
          </section>
        )}

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-purple-700 font-bold text-xl">🌱 Reflexiona</h2>
          <p>{reflectionQuestion}</p>

          <div className="flex gap-2 mt-3">
            <button className="bg-purple-500 text-white px-3 py-2 rounded" onClick={() => speak(reflectionQuestion)}>
              Escuchar pregunta
            </button>
            <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => listen(handleReflectionAnswer)}>
              Responder por voz
            </button>
            <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>
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
  );
}
