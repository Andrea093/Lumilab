import { useEffect, useRef, useState } from "react";
import Lumi from "../components/Lumi";

/* ================= VOZ ================= */
const speak = (text) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 0.85;
  u.pitch = 1.35;
  window.speechSynthesis.speak(u);
};

const stopSpeak = () => {
  window.speechSynthesis.cancel();
};

/* ================= RECONOCIMIENTO DE VOZ ================= */
const listen = (onResult) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    speak("Este navegador no permite reconocimiento de voz.");
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = "es-ES";
  rec.start();

  rec.onresult = (e) => {
    const text = e.results[0][0].transcript.toLowerCase();
    onResult(text);
  };

  rec.onerror = () => {
    speak("No se pudo reconocer la voz, intenta de nuevo.");
  };
};

/* ================= MRU ================= */
export default function MRU() {
  /* ---------- SIMULACIÓN ---------- */
  const [velocity, setVelocity] = useState(20);
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const carRef = useRef(null);
  const pos = useRef(0);

  const audioCtx = useRef(null);
  const osc = useRef(null);
  const gainNode = useRef(null);
  const animationId = useRef(null);

  /* ---------- SIMULACIÓN + SONIDO ---------- */
  const startSimulation = () => {
    if (!running) setRunning(true);
    if (!soundOn) startSound();

    speak(
      "La simulación ha iniciado. El objeto se mueve en línea recta con velocidad constante. Escucha el sonido: cuanto más agudo, mayor velocidad; cuanto más grave, menor velocidad."
    );
  };

  const stopSimulation = () => {
    setRunning(false);
    stopSound();
    stopSpeak(); // ✅ Detener voz activa
    if (animationId.current) cancelAnimationFrame(animationId.current);
  };

  useEffect(() => {
    if (running) {
      const move = () => {
        pos.current += velocity * 0.02;
        if (pos.current > 260) pos.current = 0;
        carRef.current.style.transform = `translateX(${pos.current}px)`;
        animationId.current = requestAnimationFrame(move);
      };
      move();
    } else {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    }
    return () => cancelAnimationFrame(animationId.current);
  }, [running, velocity]);

  /* ---------- SONIDO VARIABLE (PITCH) + HAPTICS ---------- */
  const startSound = () => {
    if (soundOn) return;

    audioCtx.current = new AudioContext();
    osc.current = audioCtx.current.createOscillator();
    gainNode.current = audioCtx.current.createGain();

    gainNode.current.gain.value = 0.05; // sonido más suave
    osc.current.type = "sine"; // tono más amigable
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
      const freq = 100 + velocity * 5; // más rápido = tono más agudo
      const gain = Math.min(0.05 + (velocity - 5) * 0.005, 0.1); // volumen suave
      gainNode.current.gain.setValueAtTime(gain, audioCtx.current.currentTime);
      osc.current.frequency.setValueAtTime(freq, audioCtx.current.currentTime);

      if (navigator.vibrate) {
        navigator.vibrate(Math.min(velocity * 2, 100));
      }
    }
  }, [velocity, soundOn]);

  /* ---------- EJERCICIOS NUMÉRICOS ---------- */
  const exercises = [
    {
      q: "Ejercicio 1. En el movimiento rectilíneo uniforme, ¿la velocidad cambia?",
      options: ["Sí", "No"],
      correct: ["no"],
      explain:
        "En el MRU la velocidad se mantiene constante durante todo el movimiento.",
    },
    {
      q: "Ejercicio 2. Un carro se mueve a 10 m/s durante 5 s. ¿Qué distancia recorre?",
      options: ["25 m", "50 m", "100 m"],
      correct: ["50", "50m", "cincuenta", "cincuenta metros"],
      explain:
        "La distancia se calcula multiplicando la velocidad por el tiempo: 10 por 5 = 50 metros.",
    },
    {
      q: "Ejercicio 3. Un carro recorre 120 m en 10 s. ¿Cuál es su velocidad?",
      options: ["10 m/s", "12 m/s", "15 m/s"],
      correct: ["12", "12m/s", "doce", "doce metros por segundo"],
      explain:
        "La velocidad se calcula como distancia dividido entre tiempo: 120 metros dividido entre 10 segundos = 12 metros por segundo.",
    },
    {
      q: "Ejercicio 4. Si un objeto se mueve con velocidad constante de 8 m/s durante 7 s, ¿qué distancia recorre?",
      options: ["56 m", "48 m", "64 m"],
      correct: ["56", "56m", "cincuenta y seis", "cincuenta y seis metros"],
      explain:
        "La distancia se calcula como velocidad por tiempo: 8 por 7 = 56 metros.",
    },
  ];

  const [ex, setEx] = useState(0);

  const normalizeAnswer = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .replace(/metros|m\/s|m|porsegundo|segundo/g, "")
      .trim();
  };

  const checkAnswer = (ans) => {
    const normalized = normalizeAnswer(ans);
    const corrects = exercises[ex].correct.map((c) => normalizeAnswer(c));

    if (corrects.includes(normalized)) {
      speak("¡Muy bien! Tu respuesta es correcta.");
    } else {
      speak(`No es correcto. ${exercises[ex].explain}`);
    }
  };

  /* ---------- EXPERIENCIAS ---------- */
  const experiences = [
    "Levántate de tu puesto y camina en línea recta manteniendo el mismo paso. ¿Tu velocidad se mantuvo constante?",
    "Piensa en un ascensor que sube sin acelerar. ¿Por qué podría considerarse un MRU?",
    "Imagina un tren que viaja en línea recta a velocidad constante. ¿Qué sentirías si tuvieras los ojos vendados?",
    "Simula que empujas un carrito de compras sin variar la velocidad. ¿Qué observas en su movimiento?",
  ];

  const [exp, setExp] = useState(0);

  const handleExperienceAnswer = (res) => {
    const normalized = normalizeAnswer(res);
    if (normalized.includes("constante") || normalized.includes("velocidad")) {
      speak(
        `Excelente. Noté que mencionaste '${res}', lo que indica que comprendiste que la velocidad se mantiene constante. Observaste correctamente un MRU.`
      );
    } else {
      speak(
        `Gracias por tu reflexión. Dijiste: '${res}'. Recuerda que en un MRU la velocidad se mantiene constante durante todo el movimiento.`
      );
    }
  };

  /* ---------- LUMI - BIENVENIDA Y EXPLICACIÓN ---------- */
  const lumiSpeakRef = useRef(null);

  const handleLumiWelcome = () => {
    stopSpeak();
    lumiSpeakRef.current = new SpeechSynthesisUtterance(
      "Hola, soy Lumi. Este es el módulo de Movimiento Rectilíneo Uniforme (MRU)."
    );
    lumiSpeakRef.current.lang = "es-ES";
    lumiSpeakRef.current.rate = 0.85;
    lumiSpeakRef.current.pitch = 1.35;
    window.speechSynthesis.speak(lumiSpeakRef.current);
  };

  const handleLumiExplain = () => {
    stopSpeak();
    lumiSpeakRef.current = new SpeechSynthesisUtterance(
      "El movimiento rectilíneo uniforme (MRU) es aquel en el que un objeto se desplaza en línea recta con velocidad constante, sin acelerar ni frenar."
    );
    lumiSpeakRef.current.lang = "es-ES";
    lumiSpeakRef.current.rate = 0.85;
    lumiSpeakRef.current.pitch = 1.35;
    window.speechSynthesis.speak(lumiSpeakRef.current);
  };

  const stopLumi = () => {
    if (lumiSpeakRef.current) {
      window.speechSynthesis.cancel();
      lumiSpeakRef.current = null;
    }
  };

  return (
    <div className="p-6 text-lg">
      <Lumi onExplain={handleLumiWelcome} onStop={stopLumi} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* IZQUIERDA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">
              📘 Movimiento Rectilíneo Uniforme (MRU)
            </h2>
            <p>
              El MRU ocurre cuando un objeto se mueve en línea recta con velocidad constante.
            </p>
            <p className="font-semibold mt-2">x = x₀ + v · t</p>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-purple-600 text-white px-3 py-2 rounded"
                onClick={handleLumiExplain}
              >
                Escuchar explicación
              </button>
              <button
                className="bg-gray-300 px-3 py-2 rounded"
                onClick={stopLumi}
              >
                Parar
              </button>
            </div>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🚗 Simulación</h2>

            <div className="relative h-28 bg-gray-100 rounded mt-3">
              <div
                ref={carRef}
                className="absolute left-2 top-10 w-20 h-10 bg-red-500 rounded"
              />
            </div>

            <label className="block mt-4">
              Velocidad: {velocity} m/s
              <input
                type="range"
                min="5"
                max="60"
                value={velocity}
                onChange={(e) => setVelocity(+e.target.value)}
                className="w-full"
              />
            </label>

            <div className="flex gap-3 mt-3">
              <button
                className="bg-green-600 text-white px-3 py-2 rounded"
                onClick={startSimulation}
              >
                Iniciar simulación
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded"
                onClick={stopSimulation} // ✅ ahora también detiene la voz
              >
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
              <button
                className="bg-purple-500 text-white px-3 py-2 rounded"
                onClick={() => speak(exercises[ex].q)}
              >
                Escuchar ejercicio
              </button>
              <button
                className="bg-gray-300 px-3 py-2 rounded"
                onClick={stopSpeak}
              >
                Parar
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={() => listen(checkAnswer)}
              >
                Responder por voz
              </button>
            </div>

            <button
              className="mt-3 bg-gray-200 px-3 py-2 rounded"
              onClick={() => setEx((ex + 1) % exercises.length)}
            >
              Nuevo ejercicio
            </button>
          </section>

          {/* EXPERIENCIAS */}
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-purple-700 font-bold text-xl">🌱 Experiencia</h2>
            <p>{experiences[exp]}</p>

            <button
              className="mt-3 bg-purple-600 text-white px-3 py-2 rounded"
              onClick={() => speak(experiences[exp])}
            >
              Escuchar experiencia
            </button>

            <button
              className="mt-2 bg-blue-500 text-white px-3 py-2 rounded"
              onClick={() => listen(handleExperienceAnswer)}
            >
              Responder por voz
            </button>

            <button
              className="mt-2 bg-gray-300 px-3 py-2 rounded"
              onClick={stopSpeak} // parar en experiencia
            >
              Parar
            </button>

            <button
              className="mt-3 bg-gray-200 px-3 py-2 rounded"
              onClick={() => setExp((exp + 1) % experiences.length)}
            >
              Nueva experiencia
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
