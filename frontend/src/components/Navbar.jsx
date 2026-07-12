import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";
import { useAuth } from "../context/AuthContext";
import AccessibilityPanel from "./AccessibilityPanel";

// Un solo menú desplegable para todos los tamaños de pantalla: evita que el logo,
// el eslogan y los enlaces compitan por espacio en la misma fila (lo que causaba
// que se superpusieran en anchos intermedios).
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const closeAll = () => {
    setMenuOpen(false);
    setSimOpen(false);
  };

  const handleLogout = () => {
    closeAll();
    logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* LOGO */}
        <Link to="/dashboard" onClick={closeAll} className="flex items-center gap-3 min-w-0">
          <img
            src={logoLumilab}
            alt="Lumilab"
            className="w-28 sm:w-36 h-auto object-contain shrink-0"
          />
          <div className="hidden sm:block leading-tight min-w-0">
            <div className="font-extrabold text-lg text-gray-900">Lumilab</div>
            <div className="text-xs text-violet-700 font-semibold truncate">
              Cuando enseñar se toca, se escucha y se siente
            </div>
          </div>
        </Link>

        {/* BOTÓN DE MENÚ (siempre visible, cualquier ancho) */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-gray-700"
        >
          <span aria-hidden="true" className="text-xl leading-none">☰</span>
          <span className="hidden sm:inline">Menú</span>
        </button>
      </div>

      {/* MENÚ DESPLEGABLE */}
      {menuOpen && (
        <div id="navbar-menu" className="bg-white border-t px-4 py-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <button
                onClick={() => setSimOpen((v) => !v)}
                aria-expanded={simOpen}
                className="w-full text-left font-semibold text-gray-800"
              >
                Simuladores <span aria-hidden="true">▾</span>
              </button>
              {simOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <SimLinks close={closeAll} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Link onClick={closeAll} to="/laboratorio" className="block font-semibold text-gray-800 hover:text-violet-600">
                Laboratorio
              </Link>
              <Link onClick={closeAll} to="/nosotros" className="block font-semibold text-gray-800 hover:text-violet-600">
                Nosotros
              </Link>
              {isTeacher && (
                <Link onClick={closeAll} to="/panel-docente" className="block font-semibold text-violet-700">
                  Panel docente
                </Link>
              )}
              {isAdmin && (
                <Link onClick={closeAll} to="/admin" className="block font-semibold text-violet-700">
                  Administración
                </Link>
              )}
            </div>

            <div>
              <AccessibilityPanel inline />
            </div>

            <div className="sm:text-right">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="font-semibold text-gray-800 hover:text-violet-600">
                  Salir {user?.full_name ? `(${user.full_name})` : ""}
                </button>
              ) : (
                <div className="flex flex-col sm:items-end gap-2">
                  <Link onClick={closeAll} to="/" className="font-semibold text-gray-800 hover:text-violet-600">
                    Iniciar sesión
                  </Link>
                  <Link
                    onClick={closeAll}
                    to="/registro"
                    className="inline-block px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold"
                  >
                    Inscribirse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* LINKS REUTILIZABLES */
function SimLinks({ close }) {
  return (
    <>
      <Link onClick={close} to="/mru" className="block hover:text-violet-600">
        MRU
      </Link>
      <Link onClick={close} to="/mrua" className="block hover:text-violet-600">
        MRUA
      </Link>
      <Link onClick={close} to="/mcu" className="block hover:text-violet-600">
        MCU
      </Link>
      <Link onClick={close} to="/mcua" className="block hover:text-violet-600">
        MCUA
      </Link>
      <Link onClick={close} to="/caida-libre" className="block hover:text-violet-600">
        Caída libre
      </Link>
      <Link onClick={close} to="/ondas" className="block hover:text-violet-600">
        Ondas y sonido
      </Link>
      <div className="border-t mt-2 pt-2">
        <Link onClick={close} to="/dashboard" className="block text-sm text-gray-500 hover:text-violet-600">
          Ver todos los temas (6° a 11°) →
        </Link>
      </div>
    </>
  );
}
