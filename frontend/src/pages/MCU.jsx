import { useEffect, useRef, useState } from "react";
import LumiGuide from "../components/LumiGuide";
import useLumi from "../hooks/useLumi";
import useModuleProgress from "../hooks/useModuleProgress";
import { answerMatches, normalizeAnswer } from "../utils/answer";
import { playTone, vibratePattern } from "../utils/sound";

/* ================= MCU ================= */
export default function MCU() {
  const { speak, stopSpeak, listen } = useLumi();
  const { markStarted, markExerciseResult } = useModuleProgress("mcu");
  const [feedback, setFeedback] = useState("");

  /* ---------- SIMULACIÓN ---------- */
  const [angularSpeed, setAngularSpeed] = useState(10); // velocidad angular
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const wheelRef = useRef(null);
  const angle = useRef(0);
  const animationId = useRef(null);

  const audioCtx = useRef(null);
  const osc = useRef(null);
  const gainNode = useRef(null);

  const numBaskets = 8; // número de canastas
  const basketRefs = useRef([]);
  const prevAngle = useRef(0);

  /* ---------- SONIDO SUAVE PING ---------- */
  const startSound = () => {
    if (soundOn) return;
    audioCtx.current = new AudioContext();
    osc.current = audioCtx.current.createOscillator();
    osc.current.type = "sine";
    gainNode.current = audioCtx.current.createGain();
    gainNode.current.gain.value = 0;
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

  const playPing = () => {
    if (!soundOn || !osc.current || !gainNode.current) return;
    const now = audioCtx.current.currentTime;
    gainNode.current.gain.setValueAtTime(0.3, now);
    gainNode.current.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  };

  /* ---------- SIMULACIÓN + SONIDO ---------- */
  const startSimulation = () => {
    if (!running) setRunning(true);
    if (!soundOn) startSound();
    markStarted();
    speak(
      "Simulación de movimiento circular uniforme iniciada. Escucha un ping cada vez que una canasta pasa por la parte superior."
    );
  };

  const stopSimulation = () => {
    setRunning(false);
    angle.current = 0;
    if (wheelRef.current) wheelRef.current.style.transform = `rotate(0deg)`;
    stopSound();
    if (animationId.current) cancelAnimationFrame(animationId.current);
  };

  useEffect(() => {
    if (running) {
      const move = () => {
        angle.current += angularSpeed * 0.5; // giro lento y accesible
        angle.current %= 360;
        if (angle.current < prevAngle.current) {
          // completó una vuelta: tono distinto y más largo al ping de cada canasta
          playTone({ freq: 300, duration: 0.2, type: "sawtooth", gain: 0.18 });
          vibratePattern([60, 30, 60]);
        }
        prevAngle.current = angle.current;
        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${angle.current}deg)`;

        // Chequeo de cada canasta
        basketRefs.current.forEach((b, i) => {
          const basketAngle = (360 / numBaskets) * i;
          const diff = (angle.current % 360) - basketAngle;
          if (Math.abs(diff) < 2) { // pasó por arriba
            playPing();
            if (navigator.vibrate) navigator.vibrate(50);
          }
        });

        animationId.current = requestAnimationFrame(move);
      };
      move();
    } else if (animationId.current) cancelAnimationFrame(animationId.current);

    return () => cancelAnimationFrame(animationId.current);
  }, [running, angularSpeed]);

  /* ---------- EJERCICIOS TEÓRICOS ---------- */
  const exercises = [
    {
      q: "Ejercicio 1. En MCU, ¿cómo es la magnitud de la velocidad de un objeto?",
      options: ["Constante", "Variable"],
      correct: ["constante"],
      explain: "En MCU, la velocidad angular es constante, aunque la dirección cambia."
    },
    {
      q: "Ejercicio 2. ¿Hacia dónde apunta la aceleración en un movimiento circular uniforme?",
      options: ["Hacia el centro", "Tangencial al círculo", "Hacia afuera"],
      correct: ["hacia el centro", "centripeta", "centro"],
      explain: "La aceleración centrípeta siempre apunta hacia el centro del círculo."
    },
    {
      q: "Ejercicio 3. Si un objeto gira a velocidad constante, ¿su trayectoria es?",
      options: ["Circular", "Recta", "Elíptica"],
      correct: ["circular"],
      explain: "El MCU implica que la trayectoria es un círculo."
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
    "Imagina una rueda de la fortuna girando lentamente. ¿Qué notas sobre la velocidad del movimiento?",
    "Escucha los pings de cada canasta al pasar arriba. ¿Qué indica el ritmo del sonido?"
  ];
  const [exp, setExp] = useState(0);
  const handleExperienceAnswer = (res) => {
    const normalized = normalizeAnswer(res);
    if(normalized.includes("constante")||normalized.includes("velocidad")||normalized.includes("igual")) speak(`¡Excelente! Noté que mencionaste '${res}', captaste que la velocidad angular es constante.`);
    else speak(`Gracias por tu reflexión: '${res}'. Recuerda que en MCU la velocidad angular es constante y todas las canastas giran a la misma velocidad.`);
  };

  /* ---------- LUMI ---------- */
  const handleLumiExplain = () => {
    speak("En MCU, un objeto se mueve en círculo a velocidad constante, y la aceleración siempre apunta al centro del círculo.");
  };
  const stopLumi = stopSpeak;

  /* ---------- RENDER ---------- */
  return (
    <div className="p-6 text-lg">
      <LumiGuide text="Hola, soy Lumi. Este es el módulo Movimiento Circular Uniforme, MCU." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* IZQUIERDA */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">📘 Movimiento Circular Uniforme (MCU)</h2>
            <p>El MCU (Movimiento Circular Uniforme) es cuando un objeto da vueltas en círculo siempre a la misma velocidad. Por ejemplo una rueda que gira uniformemente un carrusel que no acelera.</p>
            <p className="font-semibold mt-2">v = 2·π·r / T</p>
            <div className="flex gap-2 mt-3">
              <button className="bg-purple-600 text-white px-3 py-2 rounded" onClick={handleLumiExplain}>Escuchar explicación</button>
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={stopLumi}>Parar</button>
            </div>
          </section>

          <section className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-purple-700">🎡 Simulación Rueda de la Fortuna</h2>
            <div
              className="relative mx-auto mt-3"
              style={{ "--mcu-r": "clamp(64px, 26vw, 120px)", width: "calc(2 * var(--mcu-r) + 40px)", height: "calc(2 * var(--mcu-r) + 40px)" }}
              aria-hidden="true"
            >
              <div ref={wheelRef} className="absolute w-full h-full rounded-full border-4 border-purple-500 flex justify-center items-center origin-center">
                {Array.from({length:numBaskets}).map((_, i) => (
                  <div
                    key={i}
                    ref={el=>basketRefs.current[i]=el}
                    className="absolute w-10 h-10 bg-yellow-400 rounded-full border-2 border-red-500"
                    style={{
                      transform:`rotate(${(360/numBaskets)*i}deg) translateY(calc(var(--mcu-r) * -1)) rotate(-${(360/numBaskets)*i}deg)`
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="sr-only" role="status">
              {running ? `Rueda girando a ${angularSpeed} grados por segundo.` : "Simulación detenida."}
            </p>

            <label htmlFor="mcu-angular-speed" className="block mt-4">Velocidad angular: {angularSpeed}°/s</label>
            <input id="mcu-angular-speed" type="range" min="5" max="30" value={angularSpeed} onChange={(e)=>setAngularSpeed(+e.target.value)} className="w-full" />

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
            {exercises[ex].options.map(op=>(
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
