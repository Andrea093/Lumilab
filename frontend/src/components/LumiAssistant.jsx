import React, { useState } from "react";
import LumiCharacter from "./LumiCharacter";
import useLumi from "../hooks/useLumi";
import { topics } from "../data/topics";

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// Palabras clave -> id de tema (data/topics.js). El orden importa: entradas mas
// especificas primero, para que "mrua" no quede atrapada por una regla generica
// de "movimiento" antes de llegar a su propia regla.
const TOPIC_KEYWORDS = [
  { id: "mrua", words: ["mrua"] },
  { id: "mru", words: ["mru"] },
  { id: "mcua", words: ["mcua"] },
  { id: "mcu", words: ["mcu"] },
  { id: "caida-libre", words: ["caida libre", "caida", "gravedad", "cae", "caer"] },
  { id: "ondas-sonido", words: ["onda", "sonido", "frecuencia", "amplitud"] },
  { id: "leyes-newton", words: ["newton", "inercia", "accion y reaccion", "accion reaccion"] },
  { id: "dinamica-newton", words: ["friccion", "dinamica", "rozamiento"] },
  { id: "trabajo-potencia", words: ["potencia"] },
  { id: "trabajo-energia-mecanica", words: ["trabajo", "energia cinetica", "energia potencial", "columpio"] },
  { id: "formas-de-energia", words: ["transformacion de energia", "energia"] },
  { id: "calor-temperatura", words: ["calor", "temperatura"] },
  { id: "estados-materia", words: ["estado de la materia", "solido", "liquido", "gas", "densidad"] },
  { id: "magnitudes-unidades", words: ["magnitud", "unidad", "medir", "medicion"] },
  { id: "movimiento-basico", words: ["movimiento", "distancia", "velocidad"] },
  { id: "electricidad-estatica", words: ["estatica", "carga electrica", "electrizacion"] },
  { id: "electricidad-magnetismo", words: ["electricidad", "circuito", "corriente", "magnetismo", "iman"] },
  { id: "presion-fluidos", words: ["presion", "fluido", "flota", "empuje", "arquimedes", "pascal", "hidraulico"] },
  { id: "gravitacion-universal", words: ["planeta", "orbita", "satelite", "gravitacion"] },
  { id: "optica-geometrica", words: ["luz", "reflexion", "refraccion", "espejo", "lente", "optica"] },
];

function buildTopicAnswer(topic) {
  const where =
    topic.status === "available"
      ? "Tiene simulador interactivo: lo encuentras en el Laboratorio."
      : "Puedes leer la lección completa en Temas por grado.";
  return `${topic.summary} ${where}`;
}

export default function LumiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "lumi", text: "Hola 😊 Soy Lumi. Pregúntame sobre cualquier tema, por ejemplo 'qué es la fuerza' o 'qué es el calor'." },
  ]);
  const { speak, listen, isSpeaking, isListening } = useLumi();

  /* ---------------- RESPUESTAS ---------------- */

  const getResponse = (input) => {
    const text = normalize(input);

    if (text.includes("hola")) {
      return "Hola 💜 ¿Qué tema estás explorando?";
    }

    if (text.includes("gracias")) {
      return "¡Con gusto! 💜 Aquí estoy si necesitas algo más.";
    }

    if (text.includes("no entiendo") || text.includes("ayuda")) {
      return "No te preocupes 🌸 pregúntame por un tema, por ejemplo 'qué es la energía' o 'qué es el movimiento circular', y te explico.";
    }

    for (const entry of TOPIC_KEYWORDS) {
      if (entry.words.some((w) => text.includes(w))) {
        const topic = topics.find((t) => t.id === entry.id);
        if (topic) return buildTopicAnswer(topic);
      }
    }

    return "No estoy segura de haber entendido 🤔 Pregúntame por un tema (ej. 'qué es la gravedad'), o dime 'ayuda'.";
  };

  const handleSend = (text) => {
    if (!text) return;

    const response = getResponse(text);

    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "lumi", text: response },
    ]);

    speak(response);
  };

  const avatarState = isListening ? "listening" : isSpeaking ? "talking" : "idle";

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          id="lumi-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Asistente Lumi"
          className="w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-xl p-4 mb-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <LumiCharacter height={48} state={avatarState} decorative />
            <span className="font-semibold text-purple-700">
              Lumi · asistente
            </span>
          </div>

          <div
            className="h-40 overflow-y-auto space-y-2 text-sm mb-2"
            role="log"
            aria-live="polite"
            aria-label="Conversación con Lumi"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  m.from === "lumi"
                    ? "bg-purple-100 text-purple-900"
                    : "bg-gray-100 text-right"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <label htmlFor="lumi-assistant-input" className="sr-only">
              Escribe tu mensaje para Lumi
            </label>
            <input
              id="lumi-assistant-input"
              type="text"
              placeholder="Escribe o habla…"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(e.target.value);
                  e.target.value = "";
                }
              }}
            />

            <button
              onClick={() => listen(handleSend)}
              aria-label="Hablar con Lumi por voz"
              className="px-3 py-2 bg-purple-600 text-white rounded-lg"
            >
              <span aria-hidden="true">🎤</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="lumi-assistant-panel"
        aria-label={open ? "Cerrar asistente Lumi" : "Abrir asistente Lumi"}
        className="bg-white rounded-2xl shadow-lg border border-purple-300 px-2 pt-2 pb-1"
      >
        <LumiCharacter height={68} state={avatarState} decorative />
      </button>
    </div>
  );
}
