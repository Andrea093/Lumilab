// src/components/AudioGuideButton.jsx
import React from "react";
import useLumi from "../hooks/useLumi";

export default function AudioGuideButton({ text, className = "" }) {
  const { speak, vibrate } = useLumi();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={() => { vibrate(60); speak(text); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Escuchar</button>
      <button onClick={() => { window.speechSynthesis.cancel(); }} className="px-3 py-2 bg-gray-100 rounded-lg">Parar</button>
    </div>
  );
}
