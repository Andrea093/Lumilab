import React, { useState } from "react";
import LumiAvatar from "./LumiAvatar";
import useLumi from "../hooks/useLumi";

export default function LumiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "lumi", text: "Hola 😊 Soy Lumi. ¿En qué te ayudo hoy?" },
  ]);
  const { speak, listen, isSpeaking, isListening } = useLumi();

  /* ---------------- RESPUESTAS ---------------- */

  const getResponse = (input) => {
    const text = input.toLowerCase();

    if (text.includes("hola")) {
      return "Hola 💜 ¿Qué módulo estás explorando?";
    }

    if (text.includes("mru")) {
      return "El MRU es un movimiento con velocidad constante y sin aceleración.";
    }

    if (text.includes("mrua")) {
      return "En el MRUA la velocidad cambia porque hay aceleración constante.";
    }

    if (text.includes("mcu")) {
      return "El MCU es un movimiento circular donde la rapidez es constante.";
    }

    if (text.includes("mcua")) {
      return "El MCUA ocurre cuando el movimiento circular tiene aceleración angular.";
    }

    if (text.includes("no entiendo") || text.includes("ayuda")) {
      return "No te preocupes 🌸 dime qué parte te confunde y lo vemos paso a paso.";
    }

    return "Interesante 🤔 ¿Quieres que te lo explique de otra forma?";
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
          className="w-80 bg-white rounded-2xl shadow-xl p-4 mb-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <LumiAvatar size={36} state={avatarState} decorative />
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
        className="bg-white rounded-full shadow-lg border border-purple-300 p-1"
      >
        <LumiAvatar size={56} state={avatarState} decorative />
      </button>
    </div>
  );
}
