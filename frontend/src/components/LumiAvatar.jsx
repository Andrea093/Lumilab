import React from "react";

export default function LumiAvatar({ size = 56 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="120" height="120" rx="20" fill="#f5e1ff" />
        <circle cx="60" cy="45" r="20" fill="#ffe0bd" />
        <path d="M38 45c4-18 40-25 44 0" fill="#7c3aed" />
        <circle cx="52" cy="45" r="2.5" fill="#333" />
        <circle cx="68" cy="45" r="2.5" fill="#333" />
        <path
          d="M52 55 Q60 60 68 55"
          stroke="#c44"
          strokeWidth="2"
          fill="none"
        />
        <rect x="36" y="70" width="48" height="32" rx="10" fill="#fde047" />
      </svg>
    </div>
  );
}
