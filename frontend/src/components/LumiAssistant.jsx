import React, { useState } from "react";
import LumiAvatar from "./LumiAvatar";

// Speech APIs
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function LumiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "lumi", text: "Hola 😊 Soy Lumi. ¿En qué te ayudo hoy?" },
  ]);

  /* ---------------- VOZ ---------------- */

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "es-ES";
    speechSynthesis.speak(msg);
  };

  const recognition = SpeechRecognition
    ? new SpeechRecognition()
    : null;

  if (recognition) {
    recognition.lang = "es-ES";
    recognition.continuous = false;
  }

  const listen = () => {
    if (!recognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      handleSend(text);
    };
  };

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

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <LumiAvatar size={36} />
            <span className="font-semibold text-purple-700">
              Lumi · asistente
            </span>
          </div>

          <div className="h-40 overflow-y-auto space-y-2 text-sm mb-2">
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
            <input
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
              onClick={listen}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg"
            >
              🎤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-white rounded-full shadow-lg border border-purple-300 p-1"
      >
        <LumiAvatar size={56} />
      </button>
    </div>
  );
}
