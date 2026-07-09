import { useEffect, useRef, useState } from "react";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { answerMatches, normalizeAnswer } from "../utils/answer";

/* ================= MRUA ================= */
export default function MRUA() {
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress("mrua");
  const [feedback, setFeedback] = useState("");

  /* ---------- ESTADOS ---------- */
  const [velocity, setVelocity] = useState(0);
  const [acceleration] = useState(2);
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  /* ---------- REFERENCIAS ---------- */
  const rocketRef = useRef(null);
  const pos = useRef(0);
  const velRef = useRef(0);
  const animationId = useRef(null);

  const audioCtx = useRef(null);
  const osc = useRef(null);
  const gainNode = useRef(null);

  /* ---------- SIMULACIÓN ---------- */
  const startSimulation = () => {
    if (!running) setRunning(true);
    if (!soundOn) startSound();
    markStarted();
    speak(
      "La simulación MRUA ha iniciado. Escucha cómo el cohete acelera de manera constante."
    );
  };

  const stopSimulation = () => {
    setRunning(false);
    velRef.current = 0;
    pos.current = 0;
    setVelocity(0);
    if (rocketRef.current) rocketRef.current.style.transform = `translate(-50%, 0px)`;
    stopSound();
    stopSpeak();
    cancelAnimationFrame(animationId.current);
  };

  /* ---------- ANIMACIÓN ---------- */
  useEffect(() => {
    if (!running) return;

    const maxHeight = 200; // altura visible
    const scale = 1.5; // escala visual

    const move = () => {
      velRef.current += acceleration * 0.02;
      pos.current += velRef.current * 0.02 * scale;

      if (pos.current > maxHeight) pos.current = maxHeight;

      if (rocketRef.current)
        rocketRef.current.style.transform = `translate(-50%, -${pos.current}px)`;

      setVelocity(velRef.current);

      animationId.current = requestAnimationFrame(move);
    };

    animationId.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationId.current);
  }, [running, acceleration]);

  /* ---------- SONIDO SUAVE AMIGABLE ---------- */
  const startSound = () => {
    if (soundOn) return;

    audioCtx.current = new AudioContext();
    osc.current = audioCtx.current.createOscillator();
    osc.current.type = "sine"; // sonido suave y agradable

    gainNode.current = audioCtx.current.createGain();
    gainNode.current.gain.value = 0.05; // volumen bajo y cómodo

    osc.current.connect(gainNode.current);
    gainNode.current.connect(audioCtx.current.destination);
    osc.current.start();

    setSoundOn(true);
  };

  const stopSound = () => {
    if (osc.current) {
      osc.current.stop();
      osc.current = null;
      gainNode.current = null;
      audioCtx.current = null;
    }
    setSoundOn(false);
  };

  useEffect(() => {
    if (!soundOn || !osc.current || !gainNode.current) return;

    // tono proporcional a la velocidad
    const freq = 120 + velRef.current * 3; // más alto = más rápido
    const gain = Math.min(1.5 + velRef.current * 0.003, 2); // volumen bajo
    gainNode.current.gain.setValueAtTime(gain, audioCtx.current.currentTime);
    osc.current.frequency.setValueAtTime(freq, audioCtx.current.currentTime);

    // vibración opcional
    if (navigator.vibrate) navigator.vibrate(Math.min(velRef.current * 2, 50));
  }, [velocity, soundOn]);

  /* ---------- EJERCICIOS ---------- */
  const exercises = [
    {
      q: "Ejercicio 1. Si un cohete acelera 2 m/s² durante 5 s, ¿cuál es su velocidad final?",
      options: ["5 m/s", "10 m/s", "7 m/s"],
      correct: ["10", "10m/s", "diez"],
      explain: "v = v₀ + a·t → 0 + 2·5 = 10 m/s"
    }
  ];
  const [ex, setEx] = useState(0);

  const checkAnswer = (ans) => {
    const correct = answerMatches(ans, exercises[ex].correct);
    const message = correct ? "¡Muy bien! Tu respuesta es correcta." : `No es correcto. ${exercises[ex].explain}`;
    setFeedback(message);
    markExerciseResult(correct);
    speak(message);
  };

  /* ---------- EXPERIENCIAS ---------- */
  const experiences = [
    "Escucha un cohete despegar. ¿Qué notas sobre su velocidad?"
  ];
  const [exp, setExp] = useState(0);

  const handleExperienceAnswer = (res) => {
    const normalized = normalizeAnswer(res);
    if(normalized.includes("aumenta")||normalized.includes("acelera"))
      speak(`¡Excelente! Noté que dijiste '${res}', captaste la aceleración constante.`);
    else
      speak(`Gracias por tu reflexión: '${res}'. Recuerda que en MRUA la velocidad aumenta con aceleración constante.`);
  };

  /* ---------- LUMI ---------- */
  const handleLumiExplain = () => {
    speak("El MRUA describe un objeto que acelera en línea recta con aceleración constante.");
  };

  const stopLumi = stopSpeak;

  /* ---------- RENDER ---------- */
  return (
    <div className="p-6 text-lg bg-gray-200 rounded-xl">
      <LumiGuide text="Hola, soy Lumi. Este es el módulo MRUA, movimiento rectilíneo uniformemente acelerado." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* IZQUIERDA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">📘 MRUA - Explicación</h2>
            <p>El MRUA ocurre cuando un objeto se mueve en línea recta y su velocidad aumenta de manera constante.</p>
            <p className="font-semibold mt-2">v = v₀ + a · t</p>
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-600 text-white px-3 py-2 rounded" onClick={handleLumiExplain}>Escuchar explicación</button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopLumi}>Parar</button>
            </div>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🚀 Simulación</h2>
            <div className="relative h-64 bg-gray-300 rounded mt-3 overflow-hidden" aria-hidden="true">
              <svg ref={rocketRef} className="absolute bottom-0 left-1/2 w-16 transform -translate-x-1/2" viewBox="0 0 64 128">
                <polygon points="32,0 48,64 32,48 16,64" fill="#FF5722"/>
                <rect x="28" y="48" width="8" height="64" fill="#FF5722"/>
                <polygon points="32,112 40,128 32,120 24,128" fill="#FFC107"/>
              </svg>
            </div>
            <p className="sr-only" role="status">
              {running ? `Cohete acelerando, velocidad actual ${velocity.toFixed(1)} metros por segundo.` : "Simulación detenida."}
            </p>
            <label htmlFor="mrua-velocity" className="block mt-4">
              Velocidad: {velocity.toFixed(1)} m/s
            </label>
            <input
              id="mrua-velocity"
              type="range"
              min="0"
              max="60"
              value={velocity}
              onChange={(e)=>{
                setVelocity(+e.target.value);
                velRef.current = +e.target.value;
              }}
              className="w-full"
            />
            <div className="flex gap-3 mt-3">
              <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={startSimulation}>Iniciar simulación</button>
              <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={stopSimulation}>Detener simulación</button>
            </div>
          </section>
        </div>

        {/* DERECHA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🧠 Ejercicios</h2>
            <p>{exercises[ex].q}</p>
            {exercises[ex].options.map((op)=>(
              <button key={op} className="block mt-2 bg-blue-500 text-white px-3 py-2 rounded" onClick={()=>checkAnswer(op)}>{op}</button>
            ))}
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-500 text-white px-3 py-2 rounded" onClick={()=>speak(exercises[ex].q)}>Escuchar ejercicio</button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>Parar</button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=>listen(checkAnswer)}>Responder por voz</button>
            </div>
            <p aria-live="polite" className="mt-3 font-medium text-purple-700 min-h-[1.5em]">{feedback}</p>
            <button className="mt-3 bg-gray-200 px-3 py-2 rounded" onClick={()=>{setEx((ex+1)%exercises.length); setFeedback("");}}>Nuevo ejercicio</button>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-purple-700 font-bold text-xl">🌱 Experiencia</h2>
            <p>{experiences[exp]}</p>
            <button className="mt-3 bg-purple-600 text-white px-3 py-2 rounded" onClick={()=>speak(experiences[exp])}>Escuchar experiencia</button>
            <button className="mt-2 bg-blue-500 text-white px-3 py-2 rounded" onClick={()=>listen(handleExperienceAnswer)}>Responder por voz</button>
            <button className="mt-2 bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>Parar</button>
            <button className="mt-3 bg-gray-200 px-3 py-2 rounded" onClick={()=>setExp((exp+1)%experiences.length)}>Nueva experiencia</button>
          </section>
        </div>

      </div>
    </div>
  );
}
