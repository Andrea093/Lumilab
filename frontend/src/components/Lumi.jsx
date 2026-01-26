import React from "react";

export default function Lumi({ onExplain, onStop }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-purple-200">
      {/* Avatar bonito */}
      <div style={{ width: 72, height: 72, borderRadius: 999, overflow: "hidden" }}>
        <svg viewBox="0 0 120 120" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="20" fill="#f5e1ff"/>
          <circle cx="60" cy="45" r="20" fill="#ffe0bd"/>
          <path d="M38 45c4-18 40-25 44 0" fill="#7c3aed"/>
          <circle cx="52" cy="45" r="2.5" fill="#333"/>
          <circle cx="68" cy="45" r="2.5" fill="#333"/>
          <path d="M52 55 Q60 60 68 55" stroke="#c44" strokeWidth="2" fill="none"/>
          <rect x="36" y="70" width="48" height="32" rx="10" fill="#fde047"/>
        </svg>
      </div>

      <div className="flex-1">
        <div className="font-semibold text-purple-800">Lumi — tu guía</div>
        <p className="text-sm text-gray-600">
          Te acompaño con explicaciones por voz.
        </p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={onExplain}
            className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm"
          >
            Escuchar explicación
          </button>

          <button
            onClick={onStop} // ahora sí llama a stopLumi
            className="px-3 py-2 bg-gray-300 text-black rounded-md text-sm"
          >
            Parar
          </button>
        </div>
      </div>
    </div>
  );
}
