import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";

const STATE_LABELS = {
  idle: "Lumi está en espera",
  talking: "Lumi está hablando",
  listening: "Lumi está escuchando",
  happy: "Lumi está contenta",
  thinking: "Lumi está pensando",
};

const MOUTHS = {
  idle: "M52 55 Q60 60 68 55",
  talking: "M50 53 Q60 66 70 53 Q60 60 50 53",
  listening: "M52 56 Q60 59 68 56",
  happy: "M48 52 Q60 68 72 52",
  thinking: "M54 57 h12",
};

const EYES = {
  idle: { ry: 2.5, cy: 45 },
  talking: { ry: 2.5, cy: 45 },
  listening: { ry: 3.2, cy: 44 },
  happy: { ry: 1.2, cy: 44 },
  thinking: { ry: 2.2, cy: 43 },
};

// Avatar de Lumi: científica de laboratorio (bata, gafas de protección y una idea-luz
// sobre la cabeza) para que el personaje cuente por sí mismo el rol que cumple —guiar
// experimentos— y no solo sea una mascota genérica.
export default function LumiAvatar({ size = 56, state = "idle", decorative = false }) {
  const { reduceMotion } = useAccessibility();
  const eyes = EYES[state] || EYES.idle;
  const mouthPath = MOUTHS[state] || MOUTHS.idle;
  const animate = !reduceMotion;
  const sparkle = (state === "happy" || state === "thinking") && animate;

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : STATE_LABELS[state] || STATE_LABELS.idle}
      style={{ width: size, height: size, borderRadius: 999, overflow: "hidden", position: "relative" }}
    >
      {state === "listening" && animate && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 999,
            border: "2px solid #7c3aed",
            animation: "lumi-listen-ring 1.4s ease-out infinite",
          }}
        />
      )}
      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="#f5e1ff" />

        {/* bombilla de idea, sobre la cabeza: Lumi = luz que guía el experimento */}
        <g style={sparkle ? { animation: "lumi-sparkle 1.2s ease-in-out infinite" } : undefined}>
          <circle cx="60" cy="14" r="6" fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M57 19 h6 M58 21 h4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* pelo */}
        <path d="M38 45c4-18 40-25 44 0" fill="#7c3aed" />

        {/* cara */}
        <circle cx="60" cy="45" r="20" fill="#ffe0bd" />

        {/* gafas de laboratorio */}
        <g stroke="#334155" strokeWidth="2" fill="none">
          <circle cx="52" cy={eyes.cy} r="7.5" fill="rgba(199,229,255,0.55)" />
          <circle cx="68" cy={eyes.cy} r="7.5" fill="rgba(199,229,255,0.55)" />
          <path d="M59.5 44 h1" />
          <path d="M44.5 43 q-4 0 -4 4" strokeLinecap="round" />
          <path d="M75.5 43 q4 0 4 4" strokeLinecap="round" />
        </g>

        <ellipse cx="52" cy={eyes.cy} rx="2.5" ry={eyes.ry} fill="#333" />
        <ellipse cx="68" cy={eyes.cy} rx="2.5" ry={eyes.ry} fill="#333" />
        <path
          d={mouthPath}
          stroke="#c44"
          strokeWidth="2"
          fill="none"
          style={
            state === "talking" && animate
              ? { transformOrigin: "60px 58px", animation: "lumi-talk 0.5s ease-in-out infinite" }
              : undefined
          }
        />

        {/* bata de laboratorio con solapa, en vez del torso plano original */}
        <path d="M36 70 h48 v22 a10 10 0 0 1-10 10 h-28 a10 10 0 0 1-10-10 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M60 70 L52 80 L60 78 L68 80 Z" fill="#e2e8f0" />
        <circle cx="60" cy="90" r="1.8" fill="#94a3b8" />
        <circle cx="60" cy="96" r="1.8" fill="#94a3b8" />
      </svg>
    </div>
  );
}
