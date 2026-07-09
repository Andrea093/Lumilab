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
  const { markStarted } = useModuleProgress(topic ? `tema-${topic.slug}` : "tema-desconocido");
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    if (topic) markStarted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.slug]);

  if (!topic) {
    return <Navigate to="/dashboard" replace />;
  }

  const fullExplanation = `${topic.summary} Estándar del MEN: ${topic.menStandard}`;

  const handleReflectionAnswer = (res) => {
    setReflection(res);
    speak(`Gracias por tu reflexión: '${res}'. Sigue explorando este tema con tu profesor o profesora.`);
  };

  return (
    <div className="p-6 text-lg max-w-4xl mx-auto">
      <LumiGuide text={`Hola, soy Lumi. Vamos a explorar el tema: ${topic.title}.`} />

      <div className="mt-6 space-y-6">
        <nav aria-label="Miga de pan" className="text-sm text-gray-500">
          <Link to="/dashboard" className="hover:underline">
            Panel Lumilab
          </Link>{" "}
          / {THEMES[topic.theme] || topic.theme}
        </nav>

        <section className="bg-white p-5 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-violet-800 mb-1">{topic.title}</h1>
          <p className="text-sm text-gray-500 mb-3">
            Grado {topic.grades.join("° y ")}° · {THEMES[topic.theme] || topic.theme}
          </p>

          <p className="text-gray-800">{topic.summary}</p>
          <p className="text-sm text-gray-600 mt-3 italic">
            Estándar MEN: {topic.menStandard}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              className="bg-purple-600 text-white px-3 py-2 rounded"
              onClick={() => speak(fullExplanation)}
            >
              Escuchar explicación
            </button>
            <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>
              Parar
            </button>
          </div>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-purple-700 font-bold text-xl">🌱 Reflexiona</h2>
          <p>¿Qué ejemplo de tu vida diaria se relaciona con {topic.title.toLowerCase()}?</p>

          <div className="flex gap-2 mt-3">
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded"
              onClick={() => listen(handleReflectionAnswer)}
            >
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

        <Link to="/dashboard" className="inline-block text-violet-700 font-semibold hover:underline">
          ← Volver al panel
        </Link>
      </div>
    </div>
  );
}
