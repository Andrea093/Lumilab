import React from "react";
import { Link } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";
import LumiCharacter from "../components/LumiCharacter";

const FEATURES = [
  {
    icon: "🔬",
    title: "Laboratorio interactivo",
    text: "Simuladores de física que se ven, se escuchan y se sienten: movimiento, ondas, caída libre y más.",
  },
  {
    icon: "📚",
    title: "Temas por grado",
    text: "Currículo completo de 6° a 11°, alineado a los estándares del MEN, organizado en bloques claros.",
  },
  {
    icon: "♿",
    title: "Accesible desde el inicio",
    text: "Voz, sonido y vibración en cada experiencia, pensado para la inclusión real de las ciencias.",
  },
  {
    icon: "🧑‍🔬",
    title: "Lumi, tu guía",
    text: "Te acompaña hablando en cada pantalla, responde tus preguntas y evalúa tus reflexiones.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* HERO */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="flex-1 text-center md:text-left">
            <img src={logoLumilab} alt="Lumilab" className="w-48 mx-auto md:mx-0 mb-4" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-800 mb-3">
              Cuando enseñar se toca, se escucha y se siente
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Un laboratorio de física interactivo, con Lumi como guía, para que la ciencia sea de
              verdad para todos.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link
                to="/registro"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform"
              >
                Inscríbete gratis
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl bg-white border border-violet-300 text-violet-700 font-semibold hover:bg-violet-50"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
          <LumiCharacter
            height={220}
            state="happy"
            alt="Lumi, científica animada con bata de laboratorio, sonriendo y saludando"
            className="shrink-0"
          />
        </div>

        {/* CARACTERÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow p-6">
              <div className="text-4xl mb-3" aria-hidden="true">
                {f.icon}
              </div>
              <h2 className="font-bold text-gray-800 text-lg mb-1">{f.title}</h2>
              <p className="text-gray-600 text-sm">{f.text}</p>
            </div>
          ))}
        </div>

        {/* CTA FINAL */}
        <div className="text-center bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-bold text-violet-800 mb-2">¿Listo para explorar?</h2>
          <p className="text-gray-600 mb-5">
            Crea tu cuenta gratis y entra al laboratorio en menos de un minuto.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/registro"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform"
            >
              Inscríbete gratis
            </Link>
            <Link
              to="/nosotros"
              className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
            >
              Conoce más
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
