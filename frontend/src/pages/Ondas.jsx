import { useEffect, useMemo, useRef, useState } from "react";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { answerMatches, normalizeAnswer } from "../utils/answer";
import { playTone, vibratePattern } from "../utils/sound";

const SOUND_SPEED = 343; // m/s, velocidad del sonido en el aire
const WAVE_WIDTH = 300;
const WAVE_HEIGHT = 60;

// Dibuja una onda senoidal real (no una línea recta) con "cycles" crestas completas
// a lo largo de WAVE_WIDTH, usando curvas suaves.
function buildWavePath(cycles) {
  const amplitude = WAVE_HEIGHT * 0.35;
  const mid = WAVE_HEIGHT / 2;
  const step = WAVE_WIDTH / cycles;
  let d = `M0 ${mid}`;
  for (let i = 0; i < cycles; i++) {
    const x0 = i * step;
    const xHalf = x0 + step / 2;
    const x1 = x0 + step;
    d += ` Q ${x0 + step / 4} ${mid - amplitude}, ${xHalf} ${mid}`;
    d += ` Q ${xHalf + step / 4} ${mid + amplitude}, ${x1} ${mid}`;
  }
  return d;
}

/* ================= ONDAS Y SONIDO ================= */
export default function Ondas() {
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress("ondas");
  const [feedback, setFeedback] = useState("");

  /* ---------- SIMULACIÓN ---------- */
  const [frequency, setFrequency] = useState(440); // Hz
  const [soundOn, setSoundOn] = useState(false);

  const audioCtx = useRef(null);
  const osc = useRef(null);
  const gainNode = useRef(null);
  const pulseInterval = useRef(null);

  const wavelength = SOUND_SPEED / frequency;

  // más frecuencia = más crestas visibles y desplazamiento más rápido, igual que el pulso sonoro
  const cycles = Math.max(2, Math.min(10, Math.round(frequency / 110)));
  const wavePath = useMemo(() => buildWavePath(cycles), [cycles]);
  const waveDurationSeconds = Math.max(0.15, 1000 / frequency);

  const startSound = () => {
    if (soundOn) return;
    audioCtx.current = new AudioContext();
    osc.current = audioCtx.current.createOscillator();
    gainNode.current = audioCtx.current.createGain();
    gainNode.current.gain.value = 0.08;
    osc.current.type = "sine";
    osc.current.frequency.value = frequency;
    osc.current.connect(gainNode.current);
    gainNode.current.connect(audioCtx.current.destination);
    osc.current.start();
    setSoundOn(true);
    markStarted();
    speak(
      `Escucha el sonido a ${frequency} hercios. A mayor frecuencia, el sonido es más agudo y la longitud de onda más corta.`
    );
  };

  const stopSound = () => {
    if (osc.current) {
      osc.current.stop();
      osc.current = null;
      gainNode.current = null;
      audioCtx.current = null;
    }
    if (pulseInterval.current) {
      clearInterval(pulseInterval.current);
      pulseInterval.current = null;
    }
    setSoundOn(false);
    stopSpeak();
  };

  useEffect(() => {
    if (soundOn && osc.current) {
      osc.current.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
    }
  }, [frequency, soundOn]);

  // Pulso rítmico (tono corto + vibración) cuya cadencia se acelera con la frecuencia:
  // así una persona ciega puede "sentir" el cambio de frecuencia por el ritmo del pulso,
  // no solo por el tono continuo.
  useEffect(() => {
    if (pulseInterval.current) {
      clearInterval(pulseInterval.current);
      pulseInterval.current = null;
    }
    if (!soundOn) return;

    const ticksPerSecond = Math.min(20, Math.max(2, frequency / 20));
    const intervalMs = 1000 / ticksPerSecond;

    pulseInterval.current = setInterval(() => {
      playTone({ freq: frequency, duration: 0.06, type: "sine", gain: 0.12 });
      vibratePattern(30);
    }, intervalMs);

    return () => {
      if (pulseInterval.current) {
        clearInterval(pulseInterval.current);
        pulseInterval.current = null;
      }
    };
  }, [frequency, soundOn]);

  /* ---------- EJERCICIOS ---------- */
  const exercises = [
    {
      q: "Ejercicio 1. Si aumenta la frecuencia de una onda sonora, ¿qué pasa con su longitud de onda?",
      options: ["Aumenta", "Disminuye", "No cambia"],
      correct: ["disminuye"],
      explain:
        "La velocidad del sonido es constante en el aire, así que si la frecuencia aumenta, la longitud de onda debe disminuir (v = λ · f).",
    },
    {
      q: "Ejercicio 2. ¿Qué característica de una onda sonora determina qué tan fuerte se escucha?",
      options: ["La frecuencia", "La amplitud", "La longitud de onda"],
      correct: ["la amplitud", "amplitud"],
      explain: "La amplitud de la onda está relacionada con la energía que transporta, es decir, el volumen del sonido.",
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
    "Piensa en una guitarra: una cuerda gruesa suena grave y una cuerda delgada suena aguda. ¿Qué tiene que ver esto con la frecuencia?",
  ];
  const [exp] = useState(0);

  const handleExperienceAnswer = (res) => {
    const normalized = normalizeAnswer(res);
    if (normalized.includes("frecuencia") || normalized.includes("vibra") || normalized.includes("rapido")) {
      speak(`Excelente reflexión: '${res}'. Las cuerdas delgadas vibran más rápido, es decir, con mayor frecuencia.`);
    } else {
      speak(`Gracias por tu reflexión: '${res}'. Recuerda que a mayor frecuencia de vibración, el sonido es más agudo.`);
    }
  };

  return (
    <div className="p-6 text-lg">
      <LumiGuide text="Hola, soy Lumi. Este es el módulo de Ondas y Sonido." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* IZQUIERDA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">📘 Ondas y sonido</h2>
            <p>
              El sonido viaja como una onda. La frecuencia determina qué tan agudo o grave suena, y la
              longitud de onda es la distancia entre dos crestas consecutivas.
            </p>
            <p className="font-semibold mt-2">v = λ · f</p>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🎵 Simulación</h2>

            <div
              className="relative h-24 bg-gray-100 rounded mt-3 overflow-hidden"
              aria-hidden="true"
            >
              <svg
                viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <g>
                  <path d={wavePath} stroke="#7c3aed" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path
                    d={wavePath}
                    transform={`translate(${WAVE_WIDTH},0)`}
                    stroke="#7c3aed"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {soundOn && (
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="translate"
                      from="0 0"
                      to={`-${WAVE_WIDTH} 0`}
                      dur={`${waveDurationSeconds}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </g>
              </svg>
            </div>
            <p className="sr-only" role="status">
              {soundOn
                ? `Sonido activo a ${frequency} hercios, longitud de onda aproximada ${wavelength.toFixed(2)} metros.`
                : "Sonido detenido."}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Longitud de onda aproximada: {wavelength.toFixed(2)} m
            </p>

            <label htmlFor="ondas-frecuencia" className="block mt-4">
              Frecuencia: {frequency} Hz
            </label>
            <input
              id="ondas-frecuencia"
              type="range"
              min="100"
              max="1000"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(+e.target.value)}
              className="w-full"
            />

            <div className="flex gap-3 mt-3">
              <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={startSound}>
                Iniciar sonido
              </button>
              <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={stopSound}>
                Detener sonido
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
