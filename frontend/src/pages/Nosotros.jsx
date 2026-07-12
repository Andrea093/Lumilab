import React from "react";
import { Link } from "react-router-dom";
import LumiCharacter from "../components/LumiCharacter";
import useLumi from "../hooks/useLumi";

const PILLARS = [
  {
    icon: "👂",
    title: "Se escucha",
    text: "Cada simulación tiene voz propia: Lumi explica, pregunta y responde en voz alta, y el sonido de cada experimento cambia con la física real (más agudo, más rápido, más fuerte).",
  },
  {
    icon: "🤚",
    title: "Se siente",
    text: "La vibración del dispositivo traduce el movimiento a algo táctil: un golpe al caer, un pulso al girar, un ritmo que se acelera con la frecuencia. La física se percibe con el cuerpo, no solo con los ojos.",
  },
  {
    icon: "🎤",
    title: "Se responde con la voz",
    text: "Ningún ejercicio depende solo de tocar la pantalla: se puede contestar hablando, y Lumi escucha y responde de vuelta.",
  },
];

export default function Nosotros() {
  const { speak, stopSpeak, isSpeaking } = useLumi();
  const heroState = isSpeaking ? "talking" : "happy";

  const bioText =
    "Lumilab nació de la experiencia de Andrea Albornoz, docente de Física con diez años de trayectoria en el aula y Magíster en Educación con enfoque inclusivo. Es una herramienta pensada para buscar la inclusión desde el inicio, no como una adaptación de último momento.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* HERO */}
        <section className="flex flex-col sm:flex-row items-center gap-6 mb-10 text-center sm:text-left">
          <LumiCharacter
            height={200}
            state={heroState}
            alt="Lumi, científica animada con bata de laboratorio y una tablet con el logo de un átomo"
            className="shrink-0"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-800 mb-2">
              Nosotros
            </h1>
            <p className="text-lg text-gray-700">
              Lumilab es un laboratorio de física multisensorial: física accesible para todos,
              pensada desde el inicio con la inclusión como punto de partida, no como un ajuste de
              último momento.
            </p>
          </div>
        </section>

        {/* MISION */}
        <section className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-700 mb-3">Nuestra misión</h2>
          <p className="text-gray-700">
            La inclusión no debería ser un ajuste que se agrega después de construir la
            herramienta: debería ser el punto de partida. Por eso cada simulación de Lumilab se
            diseñó a la vez para verse, escucharse y sentirse — de modo que la barrera no esté en
            la plataforma, sino que se elimine desde el primer boceto.
          </p>
        </section>

        {/* PILARES */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl shadow p-5 text-center">
              <div className="text-4xl mb-2" aria-hidden="true">
                {p.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.text}</p>
            </div>
          ))}
        </section>

        {/* CREADORA */}
        <section className="bg-white rounded-3xl shadow p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <LumiCharacter height={56} state={isSpeaking ? "talking" : "idle"} decorative />
            <h2 className="text-xl font-bold text-purple-700">Quién está detrás de Lumilab</h2>
          </div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold text-gray-900">Andrea Albornoz</span> — Docente de
            Física, Magíster en Educación con enfoque inclusivo.
          </p>
          <p className="text-gray-700 mb-4">
            Con diez años de experiencia en educación, Andrea creó Lumilab como una herramienta que
            busca la inclusión real de las ciencias desde el inicio: un espacio donde la física se
            puede ver, escuchar y sentir, para que la forma en que cada estudiante aprende mejor
            nunca sea una barrera para acceder a ella.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => speak(bioText)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-sm"
            >
              Escuchar
            </button>
            <button onClick={stopSpeak} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-sm">
              Parar
            </button>
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/laboratorio"
            className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform"
          >
            Explorar el laboratorio →
          </Link>
        </div>
      </div>
    </div>
  );
}
