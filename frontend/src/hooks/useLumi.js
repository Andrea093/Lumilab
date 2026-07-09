// src/hooks/useLumi.js
// Punto único de voz (TTS + reconocimiento de voz), sonido ambiental y vibración para toda la app.
import { useRef, useEffect, useState, useCallback } from "react";

const SpeechRecognitionAPI =
  typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function useLumi() {
  const audioCtxRef = useRef(null);
  const oscARef = useRef(null);
  const oscBRef = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

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

  // inicia audio ambiental (requiere gesto del usuario)
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
    setAudioActive(true);

    return true;
  };

  const stopAudio = async () => {
    if (!audioCtxRef.current) return;
    try {
      oscARef.current.stop();
      oscBRef.current.stop();
      lfoRef.current.stop();
      await audioCtxRef.current.close();
    } catch {
      // el AudioContext puede ya estar cerrado; no hay nada que limpiar
    }
    audioCtxRef.current = null;
    oscARef.current = null;
    oscBRef.current = null;
    gainRef.current = null;
    lfoRef.current = null;
    setAudioActive(false);
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

  // voz (texto a voz)
  const speak = useCallback((text, opts = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang || "es-CO";
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1;
    const v = selectFemaleVoice();
    if (v) u.voice = v;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeak = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // reconocimiento de voz (voz a texto)
  const listen = useCallback((onResult, onError) => {
    if (!SpeechRecognitionAPI) {
      speak("Este navegador no permite reconocimiento de voz.");
      onError?.(new Error("SpeechRecognition no disponible"));
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "es-CO";
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setIsListening(false);
      onError?.(event);
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.start();
  }, [speak]);

  const stopListen = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // haptics
  const vibrate = (pattern) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch {
        // la vibración puede no estar permitida en este contexto; se ignora
      }
    }
  };

  return {
    startAudio,
    stopAudio,
    updateSound,
    speak,
    stopSpeak,
    listen,
    stopListen,
    vibrate,
    isSpeaking,
    isListening,
    audioActive,
    selectFemaleVoice,
  };
}
