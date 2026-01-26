// src/hooks/useLumi.js
import { useRef, useEffect } from "react";

export default function useLumi() {
  const audioCtxRef = useRef(null);
  const oscARef = useRef(null);
  const oscBRef = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);

  // seleccionar voz femenina preferida
  const selectFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const femaleRegex = /female|femenina|maria|sofia|helena|paola|carmen|lucia|luciana|paulina/i;
    // preferir es-CO
    const prefer = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("es-co"));
    if (prefer.length) {
      const f = prefer.find(v => femaleRegex.test(v.name));
      return f || prefer[0];
    }
    const es = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("es"));
    if (es.length) {
      const f = es.find(v => femaleRegex.test(v.name));
      return f || es[0];
    }
    const fAny = voices.find(v => femaleRegex.test(v.name));
    return fAny || voices[0];
  };

  useEffect(() => {
    // ensure voices loaded
    window.speechSynthesis.onvoiceschanged = () => selectFemaleVoice();
  }, []);

  // inicia audio (user gesture required)
  const startAudio = async () => {
    if (audioCtxRef.current) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    oscA.type = "sawtooth";
    oscB.type = "triangle";
    oscA.frequency.value = 40;
    oscB.frequency.value = 80;
    gain.gain.value = 0.0001;

    lfo.type = "sine";
    lfo.frequency.value = 1.2;
    lfoGain.gain.value = 4;

    lfo.connect(lfoGain);
    lfoGain.connect(oscA.frequency);

    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(ctx.destination);

    oscA.start();
    oscB.start();
    lfo.start();

    audioCtxRef.current = ctx;
    oscARef.current = oscA;
    oscBRef.current = oscB;
    gainRef.current = gain;
    lfoRef.current = lfo;

    return true;
  };

  const stopAudio = async () => {
    if (!audioCtxRef.current) return;
    try {
      oscARef.current.stop();
      oscBRef.current.stop();
      lfoRef.current.stop();
      await audioCtxRef.current.close();
    } catch (e) {}
    audioCtxRef.current = null;
    oscARef.current = null;
    oscBRef.current = null;
    gainRef.current = null;
    lfoRef.current = null;
  };

  const updateSound = (v) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !oscARef.current || !gainRef.current) return;
    const now = ctx.currentTime;
    const f1 = 40 + v * 3.5;
    const f2 = 90 + v * 2.4;
    const vol = Math.min(0.02 + v * 0.007, 0.5);
    oscARef.current.frequency.linearRampToValueAtTime(f1, now + 0.1);
    oscBRef.current.frequency.linearRampToValueAtTime(f2, now + 0.1);
    gainRef.current.gain.linearRampToValueAtTime(vol, now + 0.12);
  };

  // voz
  const speak = (text, opts = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang || "es-CO";
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1;
    const v = selectFemaleVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  // haptics
  const vibrate = (pattern) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };

  return {
    startAudio,
    stopAudio,
    updateSound,
    speak,
    vibrate,
    audioActive: !!audioCtxRef.current,
    selectFemaleVoice,
  };
}
