import { useRef, useState } from "react";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { normalizeAnswer } from "../utils/answer";

/* ================= MCUA PEDAGÓGICO ================= */
export default function MCUA() {
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress("mcua");
  const [feedback, setFeedback] = useState("");

  /* ---------- SIMULACIÓN ---------- */
  const SIZE = 300;
  const R = 105;
  const C = SIZE / 2;

  const [alpha, setAlpha] = useState(0.005);
  const alphaRef = useRef(alpha);
  const theta = useRef(0);
  const omega = useRef(0);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const raf = useRef(null);
  const carRef = useRef(null);
  const lastPingTheta = useRef(0);
  const audioCtx = useRef(null);

  const startSimulation = () => {
    if (runningRef.current) return;

    // Activa la simulación
    runningRef.current = true;
    setRunning(true);
    theta.current = 0;
    omega.current = 0;
    lastPingTheta.current = 0;

    // DESBLOQUEO AudioContext para móviles
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();

    markStarted();

    // VOZ al iniciar la simulación
    speak("Cada beep o sonido indica como la velocidad angular del carro va aumentando");

    // Inicia animación
    raf.current = requestAnimationFrame(animate);
  };

  const stopSimulation = () => {
    // Detener simulación
    runningRef.current = false;
    setRunning(false);
    cancelAnimationFrame(raf.current);

    // Detener voz
    stopSpeak();

    // Detener sonido (si usas AudioContext para campanitas)
    if (audioCtx.current) {
      audioCtx.current.close();
      audioCtx.current = null;
    }

    // Reset posición del carro al inicio
    if (carRef.current) {
      carRef.current.style.transform = `translate(${C - 20}px, ${C - 10}px)`;
    }

    // Reset variables de animación
    theta.current = 0;
    omega.current = 0;
    lastPingTheta.current = 0;
  };

  const handleAlphaChange = (value) => {
    setAlpha(value);
    alphaRef.current = value;
  };

  /* ---------- SONIDO CAMPANITAS PEDAGÓGICAS ---------- */
  const playBell = (freq) => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.value = 0.1; // volumen suave
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.12);
  };

  const animate = () => {
    if (!runningRef.current) return;

    // actualizar omega y theta
    omega.current += alphaRef.current; // incremento perceptible
    if (omega.current > 1.5) omega.current = 1.5;
    theta.current += omega.current;

    // posición abstracta para el niño vidente
    const x = C + R * Math.cos(theta.current) - 20;
    const y = C + R * Math.sin(theta.current) - 10;
    if (carRef.current) carRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${theta.current}rad)`;

    // campanita pedagógica cada π/6 rad
    const step = Math.PI / 0.2;
    if (theta.current - lastPingTheta.current >= step) {
      const freq = 50 + omega.current * 300;
      playBell(freq);
      lastPingTheta.current = theta.current;
      // vibración háptica proporcional a la velocidad angular
      if (navigator.vibrate) navigator.vibrate(Math.min(Math.floor(omega.current * 200), 50));
    }

    raf.current = requestAnimationFrame(animate);
  };

  /* ---------- TEXTO EXPLICACIÓN ---------- */
  const explanationText = `El Movimiento Circular Uniformemente Acelerado (MCUA) ocurre cuando un objeto se mueve en un círculo con aceleración angular constante.
Ecuación: ω = ω₀ + α·t`;

  /* ---------- EJERCICIOS ---------- */
  const exercises = [
    {
      q: "En MCUA, la velocidad angular del objeto:",
      options: ["Es constante", "Aumenta uniformemente", "Disminuye"],
      correct: ["aumenta uniformemente"]
    },
    {
      q: "Si la aceleración angular es constante, la velocidad tangencial:",
      options: ["No cambia", "Aumenta", "Disminuye"],
      correct: ["Aumenta"]
    }
  ];
  const [ex, setEx] = useState(0);
  const checkAnswer = (ans) => {
    const n = normalizeAnswer(ans);
    const corrects = exercises[ex].correct.map(c => normalizeAnswer(c));
    const correct = corrects.includes(n);
    const message = correct ? "¡Correcto! Muy bien, lo entendiste." : `No es correcto. Reflexiona: ${exercises[ex].q}`;
    setFeedback(message);
    markExerciseResult(correct);
    speak(message);
  };

  /* ---------- EXPERIENCIAS ---------- */
  const experiences = [
    {
      text: "Imagina un carro que acelera mientras recorre una pista circular.",
      question: "¿Qué magnitud del movimiento está aumentando?"
    },
    {
      text: "Escucha cómo cambian las campanitas a medida que el carro acelera.",
      question: "¿Qué relación notas entre la velocidad y el sonido?"
    }
  ];
  const [exp, setExp] = useState(0);
  const handleExperienceAnswer = (res) => {
    const n = normalizeAnswer(res);
    if (n.includes("velocidad") || n.includes("aceleracion") || n.includes("rapido")) {
      speak(`¡Excelente! Notaste correctamente que la velocidad y el sonido aumentan con la aceleración. Tu reflexión es correcta.`);
    } else {
      speak(`Gracias por tu reflexión: '${res}'. Intenta pensar cómo la velocidad angular y las campanitas cambian con la aceleración.`);
    }
  };

  return (
    <div className="p-6 text-lg">
      <LumiGuide text="Hola, soy Lumi. Te acompaño paso a paso para comprender el Movimiento Circular Uniformemente Acelerado, MCUA." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* IZQUIERDA: Explicación + Simulación */}
        <div className="space-y-6">

          {/* EXPLICACIÓN */}
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">📘 MCUA</h2>
            <p className="whitespace-pre-line">{explanationText}</p>
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-600 text-white px-3 py-2 rounded" onClick={() => speak(explanationText)}>Escuchar explicación</button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>Parar</button>
            </div>
          </section>

          {/* SIMULACIÓN */}
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🚗 Simulación Pedagógica</h2>
            <div className="relative mx-auto mt-4" style={{ width: SIZE, height: SIZE }} aria-hidden="true">
              <svg width={SIZE} height={SIZE}>
                <circle cx={C} cy={C} r={R} stroke="#333" strokeWidth="3" fill="none" />
              </svg>
              <div ref={carRef} style={{ position: "absolute", top: 0, left: 0, transform:`translate(${C-20}px, ${C-10}px)` }}>
                <svg width="40" height="20">
                  <rect x="0" y="4" width="40" height="12" rx="4" fill="#e53e3e"/>
                  <circle cx="10" cy="18" r="3" fill="#111"/>
                  <circle cx="30" cy="18" r="3" fill="#111"/>
                </svg>
              </div>
            </div>
            <p className="sr-only" role="status">
              {running ? `Carro acelerando en pista circular, aceleración angular ${alpha.toFixed(1)} radianes por segundo cuadrado.` : "Simulación detenida."}
            </p>

            <label htmlFor="mcua-alpha" className="block mt-4">
              Aceleración angular: {alpha.toFixed(0)} rad/s2
            </label>
            <input
              id="mcua-alpha"
              type="range"
              min="1"
              max="3"
              step="0.2"
              value={alpha}
              onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
              className="w-full mt-1"
            />

            <div className="flex gap-3 mt-3">
              <button
                className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50"
                onClick={startSimulation}
                disabled={running}
              >
                Iniciar simulación
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded disabled:opacity-50"
                onClick={stopSimulation}
                disabled={!running}
              >
                Detener simulación
              </button>
            </div>
          </section>
        </div>

        {/* DERECHA: Ejercicios + Experiencias */}
        <div className="space-y-6">

          {/* EJERCICIOS */}
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🧠 Ejercicios</h2>
            <p>{exercises[ex].q}</p>
            {exercises[ex].options.map((o) => (
              <button key={o} className="block mt-2 bg-blue-500 text-white px-3 py-2 rounded" onClick={() => checkAnswer(o)}>
                {o}
              </button>
            ))}
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-600 text-white px-3 py-2 rounded" onClick={() => speak(exercises[ex].q)}>Escuchar ejercicio</button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>Parar</button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => listen(checkAnswer)}>Responder por voz</button>
            </div>
            <p aria-live="polite" className="mt-3 font-medium text-purple-700 min-h-[1.5em]">{feedback}</p>
            <button className="mt-3 bg-gray-200 px-3 py-2 rounded" onClick={() => {setEx((ex + 1) % exercises.length); setFeedback("");}}>Nuevo ejercicio</button>
          </section>

          {/* EXPERIENCIA */}
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🌱 Experiencia</h2>
            <p>{experiences[exp].text}</p>
            <p className="font-semibold mt-2">{experiences[exp].question}</p>
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-600 text-white px-3 py-2 rounded" onClick={() => speak(experiences[exp].text + " " + experiences[exp].question)}>Escuchar experiencia</button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => listen(handleExperienceAnswer)}>Responder por voz</button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopSpeak}>Parar</button>
            </div>
            <button className="mt-3 bg-gray-200 px-3 py-2 rounded" onClick={() => setExp((exp + 1) % experiences.length)}>Nueva experiencia</button>
          </section>

        </div>
      </div>
    </div>
  );
}
