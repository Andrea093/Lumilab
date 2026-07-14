import React from "react";
import { Link } from "react-router-dom";

// Tarjeta de bloqueo para contenido marcado como premium (ver panel de Administración)
// cuando el usuario todavía no tiene acceso premium.
export default function PremiumLock({ title }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow p-8 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">
          🔒
        </div>
        <h1 className="text-2xl font-bold text-violet-800 mb-2">Contenido premium</h1>
        <p className="text-gray-600 mb-6">
          {title ? `"${title}" es` : "Este contenido es"} parte de Lumilab Premium. Desbloquéalo con un
          pago único para acceder a él y a todo el contenido premium.
        </p>
        <Link
          to="/premium"
          className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform"
        >
          Ver Lumilab Premium
        </Link>
      </div>
    </div>
  );
}
