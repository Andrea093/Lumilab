import React, { useEffect, useRef } from "react";
import LumiCharacter from "./LumiCharacter";
import useLumi from "../hooks/useLumi";
import { useAccessibility } from "../context/AccessibilityContext";

// Guía de Lumi para los módulos: personaje grande tipo compañera de videojuego, con
// una burbuja de diálogo que "dice" la explicación. Si "descripciones de audio siempre
// activas" está encendido (por defecto), habla sola al llegar, en vez de esperar a que
// alguien encuentre y toque el botón: eso es lo que la hace una guía de verdad y no solo
// una animación decorativa.
export default function LumiGuide({ text, greeting }) {
  const { speak, stopSpeak, isSpeaking } = useLumi();
  const { audioDescriptionsAlwaysOn } = useAccessibility();
  const spokenRef = useRef(false);

  const handleExplain = () => speak(greeting || text);

  useEffect(() => {
    if (!audioDescriptionsAlwaysOn || spokenRef.current) return;
    spokenRef.current = true;
    const t = setTimeout(handleExplain, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioDescriptionsAlwaysOn]);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 p-4 bg-white rounded-xl shadow-md border border-purple-200">
      <LumiCharacter height={150} state={isSpeaking ? "talking" : "idle"} className="shrink-0" />

      <div
        className={`flex-1 relative w-full bg-purple-50 rounded-2xl p-4 border-2 transition-colors ${
          isSpeaking ? "border-purple-400" : "border-purple-100"
        }`}
      >
        <span
          className="hidden sm:block absolute top-8 -left-2 w-4 h-4 bg-purple-50 border-l-2 border-b-2 border-purple-100 rotate-45"
          aria-hidden="true"
        />
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-800">Lumi — tu guía</span>
          {isSpeaking && (
            <span className="flex gap-0.5" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 lumi-char-idle" style={{ animationDelay: "0s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 lumi-char-idle" style={{ animationDelay: "0.15s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 lumi-char-idle" style={{ animationDelay: "0.3s" }} />
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">Te acompaño con explicaciones por voz.</p>

        <div className="mt-3 flex gap-2">
          <button onClick={handleExplain} className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-semibold">
            Escuchar explicación
          </button>
          <button onClick={stopSpeak} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold">
            Parar
          </button>
        </div>
      </div>
    </div>
  );
}
