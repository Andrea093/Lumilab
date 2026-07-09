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

export default function LumiAvatar({ size = 56, state = "idle", decorative = false }) {
  const { reduceMotion } = useAccessibility();
  const eyes = EYES[state] || EYES.idle;
  const mouthPath = MOUTHS[state] || MOUTHS.idle;
  const animate = !reduceMotion;

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
        <circle cx="60" cy="45" r="20" fill="#ffe0bd" />
        <path d="M38 45c4-18 40-25 44 0" fill="#7c3aed" />
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
        <rect x="36" y="70" width="48" height="32" rx="10" fill="#fde047" />
      </svg>
    </div>
  );
}
