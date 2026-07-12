import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import lumiPersonaje from "../assets/lumi-personaje.png";
import lumiVideo from "../assets/lumi-video.mp4";

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

// Lumi, la científica: cuando habla (estado "talking") se muestra el video real
// generado con IA —silenciado y en loop— para que se vea moviendo la boca de
// verdad; el audio que se escucha sigue siendo la explicación dinámica por voz
// (useLumi/speak), no el sonido fijo del video, porque lo que Lumi dice cambia
// en cada pantalla. En el resto de los estados se usa la foto fija animada por
// CSS (respirar, gesto al reaccionar), ya que ahí no está hablando.
export default function LumiCharacter({ height = 96, state = "idle", decorative = false, alt, className = "" }) {
  const { reduceMotion } = useAccessibility();
  const animClass = reduceMotion ? "" : STATE_CLASS[state] || STATE_CLASS.idle;
  const shadowClass = reduceMotion ? "" : SHADOW_CLASS[state] || SHADOW_CLASS.idle;
  const showVideo = state === "talking" && !reduceMotion;

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
      {showVideo ? (
        <video
          src={lumiVideo}
          muted
          loop
          autoPlay
          playsInline
          aria-hidden="true"
          style={{ height: "100%", width: "auto", display: "block", borderRadius: "8%" }}
        />
      ) : (
        <img
          src={lumiPersonaje}
          alt=""
          aria-hidden="true"
          className={animClass}
          style={{ height: "100%", width: "auto", display: "block", transformOrigin: "bottom center" }}
        />
      )}
    </span>
  );
}
