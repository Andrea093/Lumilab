import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-violet-800 mb-2">
            Panel Lumilab
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explora los módulos interactivos de física. Cada experiencia está pensada
            para aprender viendo, escuchando y sintiendo.
          </p>
        </div>

        {/* GRID DE MODULOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* MRU */}
          <Link
            to="/mru"
            className="group rounded-3xl p-6 bg-white shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">➡️</div>
            <h2 className="text-xl font-bold text-indigo-700 mb-1">MRU</h2>
            <p className="text-gray-600 text-sm">
              Movimiento rectilíneo uniforme. Observa velocidad constante en acción.
            </p>
            <span className="inline-block mt-4 text-indigo-600 font-semibold group-hover:underline">
              Entrar →
            </span>
          </Link>

          {/* MRUA */}
          <Link
            to="/mrua"
            className="group rounded-3xl p-6 bg-white shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-xl font-bold text-pink-600 mb-1">MRUA</h2>
            <p className="text-gray-600 text-sm">
              Movimiento acelerado. Descubre cómo cambia la velocidad.
            </p>
            <span className="inline-block mt-4 text-pink-600 font-semibold group-hover:underline">
              Entrar →
            </span>
          </Link>

          {/* MCU */}
          <Link
            to="/mcu"
            className="group rounded-3xl p-6 bg-white shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🌀</div>
            <h2 className="text-xl font-bold text-emerald-600 mb-1">MCU</h2>
            <p className="text-gray-600 text-sm">
              Movimiento circular uniforme. Trayectorias y giros constantes.
            </p>
            <span className="inline-block mt-4 text-emerald-600 font-semibold group-hover:underline">
              Entrar →
            </span>
          </Link>

          {/* MCUA */}
          <Link
            to="/mcua"
            className="group rounded-3xl p-6 bg-white shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-bold text-orange-600 mb-1">MCUA</h2>
            <p className="text-gray-600 text-sm">
              Aceleración angular. Cuando el giro cambia con el tiempo.
            </p>
            <span className="inline-block mt-4 text-orange-600 font-semibold group-hover:underline">
              Entrar →
            </span>
          </Link>

          {/* LABORATORIO - PROXIMAMENTE */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-gray-100 to-gray-200 border border-dashed border-gray-400">
            <div className="text-4xl mb-4">🧪</div>
            <h2 className="text-xl font-bold text-gray-700 mb-1">
              Laboratorio Lumilab
            </h2>
            <p className="text-gray-600 text-sm">
              Experimentos libres, retos multisensoriales y misiones guiadas.
            </p>
            <span className="inline-block mt-4 text-gray-500 font-semibold">
              Próximamente
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
