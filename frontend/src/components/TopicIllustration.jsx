import React from "react";

// Diagramas propios en SVG (no fotografías) para acompañar cada lección con una
// imagen de apoyo real, no solo un ícono. Uno por tema, simple y a color.

const VB = "0 0 240 150";

function Frame({ children, bg }) {
  return (
    <svg viewBox={VB} className="w-full h-auto" role="presentation" aria-hidden="true">
      <rect width="240" height="150" rx="18" fill={bg} />
      {children}
    </svg>
  );
}

const ILLUSTRATIONS = {
  "magnitudes-unidades": () => (
    <Frame bg="#eef2ff">
      <rect x="30" y="65" width="180" height="24" rx="4" fill="#fff" stroke="#6366f1" strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={30 + i * 30} y1="65" x2={30 + i * 30} y2={i % 2 === 0 ? "89" : "78"} stroke="#6366f1" strokeWidth="2" />
      ))}
      <text x="120" y="115" textAnchor="middle" fontSize="14" fill="#4338ca" fontWeight="bold">0 — 6 cm</text>
    </Frame>
  ),
  "estados-materia": () => (
    <Frame bg="#ecfeff">
      {[
        { x: 15, label: "Sólido", pattern: "grid" },
        { x: 92, label: "Líquido", pattern: "loose" },
        { x: 169, label: "Gas", pattern: "scattered" },
      ].map((box) => (
        <g key={box.label}>
          <rect x={box.x} y="20" width="56" height="70" rx="8" fill="#fff" stroke="#0891b2" strokeWidth="2" />
          {box.pattern === "grid" &&
            [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={box.x + 14 + c * 15} cy={35 + r * 20} r="4" fill="#0891b2" />))}
          {box.pattern === "loose" &&
            [[16, 65], [30, 75], [45, 60], [20, 45], [48, 40]].map(([dx, dy], i) => (
              <circle key={i} cx={box.x + dx} cy={dy} r="4" fill="#0891b2" />
            ))}
          {box.pattern === "scattered" &&
            [[12, 30], [45, 25], [25, 55], [50, 70], [18, 78], [40, 45]].map(([dx, dy], i) => (
              <circle key={i} cx={box.x + dx} cy={dy} r="3.5" fill="#0891b2" />
            ))}
          <text x={box.x + 28} y="106" textAnchor="middle" fontSize="12" fill="#155e75" fontWeight="bold">{box.label}</text>
        </g>
      ))}
    </Frame>
  ),
  "movimiento-basico": () => (
    <Frame bg="#f0fdf4">
      <line x1="25" y1="90" x2="215" y2="90" stroke="#22c55e" strokeWidth="3" strokeDasharray="10 8" />
      <circle cx="70" cy="90" r="10" fill="#16a34a" />
      <path d="M85 85 h20 M100 85 l-6 -5 M100 85 l-6 5" stroke="#166534" strokeWidth="2" fill="none" />
      <circle cx="170" cy="90" r="10" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
      <text x="120" y="40" textAnchor="middle" fontSize="26" aria-hidden="true">⏱️</text>
      <text x="120" y="120" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="bold">distancia · tiempo · velocidad</text>
    </Frame>
  ),
  "formas-de-energia": () => (
    <Frame bg="#fefce8">
      <circle cx="60" cy="70" r="26" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      <text x="60" y="78" textAnchor="middle" fontSize="24" aria-hidden="true">💡</text>
      <path d="M95 70 h40" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow-energia)" />
      <defs>
        <marker id="arrow-energia" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#d97706" />
        </marker>
      </defs>
      <circle cx="175" cy="70" r="26" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
      <text x="175" y="78" textAnchor="middle" fontSize="24" aria-hidden="true">🔥</text>
      <text x="120" y="125" textAnchor="middle" fontSize="12" fill="#92400e" fontWeight="bold">la energía se transforma</text>
    </Frame>
  ),
  "calor-temperatura": () => (
    <Frame bg="#fff1f2">
      <rect x="110" y="20" width="18" height="70" rx="9" fill="#fff" stroke="#e11d48" strokeWidth="2" />
      <circle cx="119" cy="100" r="16" fill="#e11d48" />
      <rect x="114" y="55" width="10" height="40" fill="#e11d48" />
      <circle cx="60" cy="55" r="18" fill="#fecaca" stroke="#e11d48" strokeWidth="2" />
      <circle cx="180" cy="55" r="18" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
      <path d="M80 55 h30" stroke="#e11d48" strokeWidth="3" markerEnd="url(#arrow-calor)" />
      <defs>
        <marker id="arrow-calor" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#e11d48" />
        </marker>
      </defs>
      <text x="120" y="132" textAnchor="middle" fontSize="12" fill="#9f1239" fontWeight="bold">el calor viaja de lo caliente a lo frío</text>
    </Frame>
  ),
  "leyes-newton": () => (
    <Frame bg="#eff6ff">
      <rect x="100" y="60" width="40" height="30" rx="4" fill="#3b82f6" />
      <path d="M145 75 h35" stroke="#1d4ed8" strokeWidth="4" markerEnd="url(#arrow-n1)" />
      <path d="M95 75 h-35" stroke="#f97316" strokeWidth="4" markerEnd="url(#arrow-n2)" />
      <defs>
        <marker id="arrow-n1" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#1d4ed8" />
        </marker>
        <marker id="arrow-n2" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
          <path d="M8 0 L0 4 L8 8 Z" fill="#f97316" />
        </marker>
      </defs>
      <text x="180" y="65" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="bold">acción</text>
      <text x="35" y="65" textAnchor="middle" fontSize="12" fill="#c2410c" fontWeight="bold">reacción</text>
      <text x="120" y="125" textAnchor="middle" fontSize="12" fill="#1e3a8a" fontWeight="bold">F = m · a</text>
    </Frame>
  ),
  "trabajo-energia-mecanica": () => (
    <Frame bg="#faf5ff">
      <path d="M40 30 A70 70 0 0 0 200 30" stroke="#9333ea" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <circle cx="40" cy="30" r="12" fill="#c084fc" />
      <circle cx="120" cy="100" r="12" fill="#7e22ce" />
      <text x="40" y="18" textAnchor="middle" fontSize="10" fill="#6b21a8" fontWeight="bold">potencial</text>
      <text x="120" y="128" textAnchor="middle" fontSize="10" fill="#6b21a8" fontWeight="bold">cinética</text>
    </Frame>
  ),
  "electricidad-estatica": () => (
    <Frame bg="#fdf4ff">
      <ellipse cx="90" cy="65" rx="34" ry="42" fill="#f0abfc" stroke="#a21caf" strokeWidth="2" />
      <path d="M90 107 v14" stroke="#a21caf" strokeWidth="2" />
      <text x="78" y="55" fontSize="16" fill="#701a75" fontWeight="bold">−</text>
      <text x="98" y="70" fontSize="16" fill="#701a75" fontWeight="bold">−</text>
      <text x="82" y="85" fontSize="16" fill="#701a75" fontWeight="bold">−</text>
      {[[175, 40], [190, 60], [170, 75], [195, 90]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="8" height="10" fill="#e879f9" />
          <line x1={x + 4} y1={y} x2="126" y2="65" stroke="#e879f9" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
    </Frame>
  ),
  "presion-fluidos": () => (
    <Frame bg="#ecfeff">
      <path d="M20 90 q100 20 200 0" stroke="#0891b2" strokeWidth="3" fill="none" />
      <path d="M20 90 q100 18 200 0 v20 h-200 Z" fill="#a5f3fc" opacity="0.6" />
      <path d="M65 70 L120 70 L110 90 L75 90 Z" fill="#fff" stroke="#0e7490" strokeWidth="2" />
      <path d="M92 70 v-25 l18 25 Z" fill="#fff" stroke="#0e7490" strokeWidth="2" />
      <path d="M92 105 v20" stroke="#0e7490" strokeWidth="3" markerEnd="url(#arrow-boya)" />
      <defs>
        <marker id="arrow-boya" markerWidth="9" markerHeight="9" refX="4" refY="0" orient="auto">
          <path d="M0 8 L8 8 L4 0 Z" fill="#0e7490" />
        </marker>
      </defs>
      <text x="92" y="140" textAnchor="middle" fontSize="11" fill="#0e7490" fontWeight="bold">empuje</text>
    </Frame>
  ),
  "dinamica-newton": () => (
    <Frame bg="#fff7ed">
      <line x1="20" y1="100" x2="220" y2="100" stroke="#78350f" strokeWidth="3" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={25 + i * 20} y1="100" x2={15 + i * 20} y2="112" stroke="#78350f" strokeWidth="2" />
      ))}
      <rect x="90" y="65" width="50" height="35" rx="4" fill="#f97316" />
      <path d="M145 82 h35" stroke="#1d4ed8" strokeWidth="4" markerEnd="url(#arrow-din1)" />
      <path d="M85 82 h-25" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrow-din2)" />
      <defs>
        <marker id="arrow-din1" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#1d4ed8" />
        </marker>
        <marker id="arrow-din2" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto">
          <path d="M8 0 L0 4 L8 8 Z" fill="#dc2626" />
        </marker>
      </defs>
      <text x="185" y="72" textAnchor="middle" fontSize="11" fill="#1e3a8a" fontWeight="bold">fuerza</text>
      <text x="45" y="72" textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">fricción</text>
    </Frame>
  ),
  "trabajo-potencia": () => (
    <Frame bg="#f0f9ff">
      <path d="M40 110 L40 60 L90 30" stroke="#0369a1" strokeWidth="3" fill="none" strokeDasharray="6 4" />
      <circle cx="90" cy="30" r="9" fill="#0369a1" />
      <text x="65" y="105" fontSize="11" fill="#0369a1" fontWeight="bold">lento</text>
      <path d="M150 110 L165 55 L200 30" stroke="#facc15" strokeWidth="3" fill="none" />
      <circle cx="200" cy="30" r="9" fill="#eab308" />
      <path d="M175 42 l6 -10 l4 6 l8 -12" stroke="#eab308" strokeWidth="2" fill="none" />
      <text x="175" y="105" fontSize="11" fill="#a16207" fontWeight="bold">rápido = más potencia</text>
    </Frame>
  ),
  "gravitacion-universal": () => (
    <Frame bg="#eef2ff">
      <circle cx="110" cy="80" r="28" fill="#6366f1" />
      <ellipse cx="110" cy="80" rx="75" ry="30" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="5 4" />
      <circle cx="185" cy="65" r="9" fill="#c7d2fe" stroke="#4338ca" strokeWidth="1.5" />
      <path d="M175 68 L120 78" stroke="#4338ca" strokeWidth="2" markerEnd="url(#arrow-grav)" />
      <defs>
        <marker id="arrow-grav" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#4338ca" />
        </marker>
      </defs>
      <text x="120" y="135" textAnchor="middle" fontSize="11" fill="#3730a3" fontWeight="bold">gravedad = órbita</text>
    </Frame>
  ),
  "electricidad-magnetismo": () => (
    <Frame bg="#fefce8">
      <rect x="30" y="70" width="26" height="14" fill="#78350f" />
      <text x="43" y="65" textAnchor="middle" fontSize="10" fill="#78350f" fontWeight="bold">+ −</text>
      <path d="M56 77 h60" stroke="#a16207" strokeWidth="3" />
      {[80, 96, 112].map((x) => (
        <path key={x} d={`M${x} 60 a16 16 0 0 1 0 34`} stroke="#facc15" strokeWidth="2" fill="none" />
      ))}
      <path d="M116 77 h50" stroke="#a16207" strokeWidth="3" />
      <circle cx="185" cy="77" r="18" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
      <text x="185" y="83" textAnchor="middle" fontSize="18" aria-hidden="true">💡</text>
    </Frame>
  ),
  "optica-geometrica": () => (
    <Frame bg="#f0fdfa">
      <rect x="20" y="95" width="200" height="6" fill="#94a3b8" />
      <path d="M35 40 L95 95" stroke="#f59e0b" strokeWidth="3" />
      <path d="M95 95 L150 40" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow-luz)" />
      <defs>
        <marker id="arrow-luz" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#f59e0b" />
        </marker>
      </defs>
      <rect x="20" y="101" width="200" height="30" fill="#5eead4" opacity="0.5" />
      <path d="M150 40 L170 60 L155 101" stroke="#0d9488" strokeWidth="3" strokeDasharray="4 3" fill="none" />
      <text x="120" y="140" textAnchor="middle" fontSize="11" fill="#115e59" fontWeight="bold">reflexión y refracción</text>
    </Frame>
  ),
};

export default function TopicIllustration({ topicId, className = "" }) {
  const Illustration = ILLUSTRATIONS[topicId];
  if (!Illustration) return null;
  return (
    <div className={`rounded-2xl overflow-hidden shadow-inner ${className}`}>
      <Illustration />
    </div>
  );
}
