import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import lumiPersonaje from "../assets/lumi-personaje.png";

const STATE_LABELS = {
  idle: "Lumi está en espera",
  talking: "Lumi está hablando",
  listening: "Lumi está escuchando",
  happy: "Lumi está contenta",
  thinking: "Lumi está pensando",
};

const STATE_CLASS = {
  idle: "lumi-char-idle",
  talking: "lumi-char-talking",
  listening: "lumi-char-talking",
  happy: "lumi-char-talking",
  thinking: "lumi-char-idle",
};

const SHADOW_CLASS = {
  idle: "lumi-shadow-idle",
  talking: "lumi-shadow-talking",
  listening: "lumi-shadow-talking",
  happy: "lumi-shadow-talking",
  thinking: "lumi-shadow-idle",
};

// Lumi, la científica ilustrada: reemplaza el ícono SVG en todos los lugares donde
// acompaña al estudiante. Un solo movimiento simple y siempre igual: en reposo
// respira suavemente, y en cuanto habla (incluye escuchar/contenta, que también
// hablan al reaccionar) hace el mismo gesto de "hablar" cada vez, sin variaciones
// ni aleatoriedad — fácil de reconocer y predecible.
export default function LumiCharacter({ height = 96, state = "idle", decorative = false, alt, className = "" }) {
  const { reduceMotion } = useAccessibility();
  const animClass = reduceMotion ? "" : STATE_CLASS[state] || STATE_CLASS.idle;
  const shadowClass = reduceMotion ? "" : SHADOW_CLASS[state] || SHADOW_CLASS.idle;

  return (
    <span
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : alt || STATE_LABELS[state] || STATE_LABELS.idle}
      className={`relative inline-block ${className}`}
      style={{ height, lineHeight: 0 }}
    >
      {state === "listening" && !reduceMotion && (
        <span
          aria-hidden="true"
          className="absolute rounded-full border-2 border-violet-500"
          style={{ inset: "-6%", animation: "lumi-listen-ring 1.4s ease-out infinite" }}
        />
      )}
      <span
        aria-hidden="true"
        className={`absolute left-1/2 rounded-full bg-black/25 blur-[2px] ${shadowClass}`}
        style={{ bottom: "-4%", width: "46%", height: "8%", marginLeft: "-23%" }}
      />
      <img
        src={lumiPersonaje}
        alt=""
        aria-hidden="true"
        className={animClass}
        style={{ height: "100%", width: "auto", display: "block", transformOrigin: "bottom center" }}
      />
    </span>
  );
}
