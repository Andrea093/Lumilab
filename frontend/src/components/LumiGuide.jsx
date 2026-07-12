import React from "react";
import LumiCharacter from "./LumiCharacter";
import useLumi from "../hooks/useLumi";

// Guía de Lumi para los módulos: avatar + explicación por voz, con estado visual reactivo.
export default function LumiGuide({ text, greeting }) {
  const { speak, stopSpeak, isSpeaking } = useLumi();

  const handleExplain = () => speak(greeting || text);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-purple-200">
      <LumiCharacter height={96} state={isSpeaking ? "talking" : "idle"} />

      <div className="flex-1">
        <div className="font-semibold text-purple-800">Lumi — tu guía</div>
        <p className="text-sm text-gray-600">
          Te acompaño con explicaciones por voz.
        </p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleExplain}
            className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm"
          >
            Escuchar explicación
          </button>

          <button
            onClick={stopSpeak}
            className="px-3 py-2 bg-gray-300 text-black rounded-md text-sm"
          >
            Parar
          </button>
        </div>
      </div>
    </div>
  );
}
