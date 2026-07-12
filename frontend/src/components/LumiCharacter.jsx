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
  listening: "lumi-char-listening",
  happy: "lumi-char-happy",
  thinking: "lumi-char-thinking",
};

// Lumi, la científica ilustrada: reemplaza el ícono SVG en todos los lugares donde
// acompaña al estudiante. Un solo retrato se anima por CSS (flota, se inclina al
// escuchar, se mece al hablar, salta al estar contenta) para transmitir presencia
// y gesto sin depender de varias imágenes.
export default function LumiCharacter({ height = 96, state = "idle", decorative = false, alt, className = "" }) {
  const { reduceMotion } = useAccessibility();
  const animClass = reduceMotion ? "" : STATE_CLASS[state] || STATE_CLASS.idle;

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
      <img src={lumiPersonaje} alt="" aria-hidden="true" className={animClass} style={{ height: "100%", width: "auto", display: "block" }} />
    </span>
  );
}
