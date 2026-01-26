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

const stopSpeak = () => window.speechSynthesis.cancel();

/* ================= RECONOCIMIENTO DE VOZ ================= */
const listen = (onResult) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    speak("Este navegador no permite reconocimiento de voz.");
    return;
  }
  const rec = new SpeechRecognition();
  rec.lang = "es-ES";
  rec.start();
  rec.onresult = (e) => onResult(e.results[0][0].transcript.toLowerCase());
  rec.onerror = () => speak("No se pudo reconocer la voz, intenta de nuevo.");
};

/* ================= MCU ================= */
export default function MCU() {
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

  /* ---------- SIMULACIÓN + SONIDO ---------- */
  const startSimulation = () => {
    if (!running) setRunning(true);
    if (!soundOn) startSound();
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
  const normalizeAnswer = (text) => text.toLowerCase().replace(/\s+/g,"").replace(/metros|m\/s|m|porsegundo|segundo|π|pi/g,"").trim();
  const checkAnswer = (ans) => {
    const n = normalizeAnswer(ans);
    const corrects = exercises[ex].correct.map(c=>normalizeAnswer(c));
    corrects.includes(n)?speak("¡Muy bien! Tu respuesta es correcta."):speak(`No es correcto. ${exercises[ex].explain}`);
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
  const lumiRef = useRef(null);
  const handleLumiWelcome = ()=>{
    stopSpeak();
    lumiRef.current = new SpeechSynthesisUtterance("Hola, soy Lumi. Este es el módulo Movimiento Circular Uniforme, MCU.");
    lumiRef.current.lang="es-ES"; lumiRef.current.rate=0.85; lumiRef.current.pitch=1.35;
    window.speechSynthesis.speak(lumiRef.current);
  };
  const handleLumiExplain = ()=>{
    stopSpeak();
    lumiRef.current = new SpeechSynthesisUtterance("En MCU, un objeto se mueve en círculo a velocidad constante, y la aceleración siempre apunta al centro del círculo.");
    lumiRef.current.lang="es-ES"; lumiRef.current.rate=0.85; lumiRef.current.pitch=1.35;
    window.speechSynthesis.speak(lumiRef.current);
  };
  const stopLumi = ()=>{ if(lumiRef.current){window.speechSynthesis.cancel(); lumiRef.current=null;} };

  /* ---------- RENDER ---------- */
  return (
    <div className="p-6 text-lg">
      <Lumi onExplain={handleLumiWelcome} onStop={stopLumi} />

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
            <div className="relative w-64 h-64 mx-auto mt-3">
              <div ref={wheelRef} className="absolute w-full h-full rounded-full border-4 border-purple-500 flex justify-center items-center origin-center">
                {Array.from({length:numBaskets}).map((_, i) => (
                  <div
                    key={i}
                    ref={el=>basketRefs.current[i]=el}
                    className="absolute w-10 h-10 bg-yellow-400 rounded-full border-2 border-red-500"
                    style={{
                      transform:`rotate(${(360/numBaskets)*i}deg) translateY(-120px) rotate(-${(360/numBaskets)*i}deg)`
                    }}
                  />
                ))}
              </div>
            </div>

            <label className="block mt-4">Velocidad angular: {angularSpeed}°/s
              <input type="range" min="5" max="30" value={angularSpeed} onChange={(e)=>setAngularSpeed(+e.target.value)} className="w-full" />
            </label>

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
            <button className="mt-3 bg-gray-200 px-3 py-2 rounded" onClick={()=>setEx((ex+1)%exercises.length)}>Nuevo ejercicio</button>
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
