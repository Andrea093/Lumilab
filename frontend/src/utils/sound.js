// Efectos sonoros cortos (no continuos) para marcar eventos de las simulaciones:
// aterrizajes, vueltas completas, hitos alcanzados. Complementan el tono continuo
// que cada módulo ya genera, dando una señal auditiva/táctil distinta para "algo pasó",
// clave para quien no puede ver el movimiento en pantalla.

let sharedCtx = null;

function getCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new Ctx();
  return sharedCtx;
}

// Un solo tono corto con envolvente (ataque/caída), tipo "ping" o "beep".
export function playTone({ freq = 440, duration = 0.15, type = "sine", gain = 0.2, delay = 0 } = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

// Secuencia de tonos ascendentes o descendentes, para "logro"/"hito" o "impacto".
export function playChime(freqs = [660, 880], { duration = 0.12, gap = 0.09, type = "triangle", gain = 0.2 } = {}) {
  freqs.forEach((freq, i) => {
    playTone({ freq, duration, type, gain, delay: i * gap });
  });
}

// Golpe grave y corto, para caídas/impactos.
export function playThud({ gain = 0.35 } = {}) {
  playTone({ freq: 90, duration: 0.22, type: "square", gain });
}

// Vibración en patrón (array de ms encendido/apagado), con manejo defensivo.
export function vibratePattern(pattern) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // la vibración puede no estar permitida en este contexto; se ignora
    }
  }
}
