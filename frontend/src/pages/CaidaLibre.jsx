import { useEffect, useRef, useState } from "react";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { answerMatches, normalizeAnswer } from "../utils/answer";
import { playThud, vibratePattern } from "../utils/sound";

const GRAVITY = 9.8; // m/s²

/* ================= CAÍDA LIBRE ================= */
export default function CaidaLibre() {
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress("caida-libre");
  const [feedback, setFeedback] = useState("");

  /* ---------- SIMULACIÓN ---------- */
  const [height, setHeight] = useState(45); // altura inicial en metros
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [fallenY, setFallenY] = useState(0);
  const [velocity, setVelocity] = useState(0);

  const objectRef = useRef(null);
  const timeRef = useRef(0);
  const animationId = useRef(null);

  const audioCtx = useRef(null);
  const osc = useRef(null);
  const gainNode = useRef(null);

  const maxDrop = 220; // px visibles en la caja de simulación

  const startSimulation = () => {
    if (!running) setRunning(true);
    if (!soundOn) startSound();
    timeRef.current = 0;
    markStarted();
    speak(
      `La simulación de caída libre ha iniciado desde ${height} metros. Escucha cómo el sonido se agudiza a medida que el objeto acelera.`
    );
  };

  const stopSimulation = () => {
    setRunning(false);
    timeRef.current = 0;
    setFallenY(0);
    setVelocity(0);
    stopSound();
    stopSpeak();
    if (animationId.current) cancelAnimationFrame(animationId.current);
  };

  useEffect(() => {
    if (!running) return;

    const move = () => {
      timeRef.current += 0.02;
      const t = timeRef.current;
      const v = GRAVITY * t;
      const y = 0.5 * GRAVITY * t * t;

      const maxFallDistance = height; // metros hasta tocar el suelo
      if (y >= maxFallDistance) {
        setFallenY(maxDrop);
        setVelocity(Math.sqrt(2 * GRAVITY * maxFallDistance));
        setRunning(false);
        stopSound();
        playThud();
        vibratePattern([120, 40, 200]);
        speak("El objeto llegó al suelo.");
        return;
      }

      setFallenY(Math.min((y / maxFallDistance) * maxDrop, maxDrop));
      setVelocity(v);

      animationId.current = requestAnimationFrame(move);
    };

    animationId.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, height]);

  /* ---------- SONIDO VARIABLE (PITCH) + HAPTICS ---------- */
  const startSound = () => {
    if (soundOn) return;
    audioCtx.current = new AudioContext();
    osc.current = audioCtx.current.createOscillator();
    gainNode.current = audioCtx.current.createGain();
    gainNode.current.gain.value = 0.05;
    osc.current.type = "sine";
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
    if (soundOn && osc.current && gainNode.current) {
      const freq = 100 + velocity * 4;
      const gain = Math.min(0.05 + velocity * 0.004, 0.15);
      gainNode.current.gain.setValueAtTime(gain, audioCtx.current.currentTime);
      osc.current.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      if (navigator.vibrate) navigator.vibrate(Math.min(Math.floor(velocity * 2), 100));
    }
  }, [velocity, soundOn]);

  /* ---------- EJERCICIOS ---------- */
  const exercises = [
    {
      q: "Ejercicio 1. En caída libre, ¿de qué depende la aceleración de un objeto?",
      options: ["De su masa", "De la gravedad", "De su forma"],
      correct: ["de la gravedad", "gravedad", "la gravedad"],
      explain:
        "En caída libre (sin fricción del aire), la aceleración es siempre la de la gravedad, sin importar la masa del objeto.",
    },
    {
      q: "Ejercicio 2. Un objeto cae libremente durante 3 segundos. ¿Cuál es aproximadamente su velocidad? (usa g = 9.8 m/s²)",
      options: ["9.8 m/s", "19.6 m/s", "29.4 m/s"],
      correct: ["29.4", "29,4", "veintinueve"],
      explain: "v = g · t = 9.8 × 3 = 29.4 m/s aproximadamente.",
    },
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
    "Imagina que sueltas una pelota y una hoja de papel desde la misma altura, sin viento. ¿Por qué caerían al mismo tiempo en el vacío?",
  ];
  const [exp] = useState(0);

  const handleExperienceAnswer = (res) => {
    const normalized = normalizeAnswer(res);
    if (normalized.includes("gravedad") || normalized.includes("mismo") || normalized.includes("aceleracion")) {
      speak(`Excelente. Noté que mencionaste '${res}'. En el vacío, la gravedad acelera a todos los cuerpos por igual.`);
    } else {
      speak(`Gracias por tu reflexión. Dijiste: '${res}'. Recuerda que sin aire, todos los cuerpos caen con la misma aceleración.`);
    }
  };

  return (
    <div className="p-6 text-lg">
      <LumiGuide text="Hola, soy Lumi. Este es el módulo de Caída Libre." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* IZQUIERDA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">📘 Caída libre</h2>
            <p>
              La caída libre es un caso particular del movimiento uniformemente acelerado, donde la
              aceleración es la de la gravedad (g ≈ 9.8 m/s²).
            </p>
            <p className="font-semibold mt-2">v = g · t &nbsp; | &nbsp; y = ½ · g · t²</p>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🍎 Simulación</h2>

            <div
              className="relative bg-gray-100 rounded mt-3 overflow-hidden"
              style={{ height: "clamp(160px, 45vw, 260px)" }}
              aria-hidden="true"
            >
              <div
                ref={objectRef}
                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-red-500 rounded-full"
                style={{ top: fallenY }}
              />
            </div>
            <p className="sr-only" role="status">
              {running
                ? `Objeto cayendo, velocidad actual ${velocity.toFixed(1)} metros por segundo.`
                : "Simulación detenida."}
            </p>

            <label htmlFor="caida-altura" className="block mt-4">
              Altura inicial: {height} m
            </label>
            <input
              id="caida-altura"
              type="range"
              min="10"
              max="100"
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
              className="w-full"
              disabled={running}
            />

            <div className="flex gap-3 mt-3">
              <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={startSimulation}>
                Iniciar simulación
              </button>
              <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={stopSimulation}>
                Detener simulación
              </button>
            </div>
          </section>
        </div>

        {/* DERECHA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🧠 Ejercicios</h2>
            <p>{exercises[ex].q}</p>
            {exercises[ex].options.map((op) => (
              <button
                key={op}
                className="block mt-2 bg-blue-500 text-white px-3 py-2 rounded"
                onClick={() => checkAnswer(op)}
              >
                {op}
              </button>
            ))}
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-500 text-white px-3 py-2 rounded" onClick={() => speak(exercises[ex].q)}>
                Escuchar ejercicio
              </button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>
                Parar
              </button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => listen(checkAnswer)}>
                Responder por voz
              </button>
            </div>
            <p aria-live="polite" className="mt-3 font-medium text-purple-700 min-h-[1.5em]">
              {feedback}
            </p>
            <button
              className="mt-3 bg-gray-200 px-3 py-2 rounded"
              onClick={() => {
                setEx((ex + 1) % exercises.length);
                setFeedback("");
              }}
            >
              Nuevo ejercicio
            </button>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-purple-700 font-bold text-xl">🌱 Experiencia</h2>
            <p>{experiences[exp]}</p>
            <button className="mt-3 bg-purple-600 text-white px-3 py-2 rounded" onClick={() => speak(experiences[exp])}>
              Escuchar experiencia
            </button>
            <button className="mt-2 bg-blue-500 text-white px-3 py-2 rounded" onClick={() => listen(handleExperienceAnswer)}>
              Responder por voz
            </button>
            <button className="mt-2 bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>
              Parar
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
