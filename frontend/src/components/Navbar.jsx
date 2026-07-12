import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";
import { useAuth } from "../context/AuthContext";
import AccessibilityPanel from "./AccessibilityPanel";

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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/dashboard"
          onClick={closeAll}
          className="flex items-center gap-3"
        >
          <img
            src={logoLumilab}
            alt="Lumilab"
            className="w-36 lg:w-52 h-auto object-contain"
          />

          {/* SLOGAN SOLO EN DESKTOP */}
          <div className="hidden lg:block leading-tight">
            <div className="font-extrabold text-lg text-gray-900">
              Lumilab
            </div>
            <div className="text-xs text-violet-700 font-semibold">
              Cuando enseñar se toca, se escucha y se siente
            </div>
          </div>
        </Link>

        {/* BOTÓN HAMBURGUESA (MOBILE) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-2xl"
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-menu"
          aria-label={menuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        >
          <span aria-hidden="true">☰</span>
        </button>

        {/* NAV DESKTOP */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-4 xl:gap-6 text-gray-700 font-medium">

          {/* SIMULADORES */}
          <div className="relative">
            <button
              onClick={() => setSimOpen(!simOpen)}
              aria-expanded={simOpen}
              aria-haspopup="true"
              className="px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-1"
            >
              Simuladores <span aria-hidden="true">▾</span>
            </button>

            {simOpen && (
              <div className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-lg border p-2">
                <SimLinks close={closeAll} />
              </div>
            )}
          </div>

          <Link to="/laboratorio" className="px-4 py-2 rounded-lg hover:bg-gray-100">
            Laboratorio
          </Link>

          <Link to="/nosotros" className="px-4 py-2 rounded-lg hover:bg-gray-100">
            Nosotros
          </Link>

          {isTeacher && (
            <Link to="/panel-docente" className="px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold text-violet-700">
              Panel docente
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold text-violet-700">
              Administración
            </Link>
          )}

          <AccessibilityPanel />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {user?.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-gray-100">
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                Inscribirse
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* NAV MOBILE */}
      {menuOpen && (
        <div id="navbar-mobile-menu" className="lg:hidden bg-white border-t px-4 py-4 space-y-3">

          <button
            onClick={() => setSimOpen(!simOpen)}
            aria-expanded={simOpen}
            className="w-full text-left font-semibold text-gray-800"
          >
            Simuladores <span aria-hidden="true">▾</span>
          </button>

          {simOpen && (
            <div className="pl-4 space-y-2">
              <SimLinks close={closeAll} />
            </div>
          )}

          <Link onClick={closeAll} to="/laboratorio" className="block">
            Laboratorio
          </Link>

          <Link onClick={closeAll} to="/nosotros" className="block">
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

          <AccessibilityPanel />

          {isAuthenticated ? (
            <button onClick={handleLogout} className="block w-full text-left font-semibold text-gray-800">
              Salir ({user?.full_name})
            </button>
          ) : (
            <>
              <Link onClick={closeAll} to="/" className="block">
                Iniciar sesión
              </Link>
              <Link onClick={closeAll} to="/registro" className="block font-semibold text-violet-700">
                Inscribirse
              </Link>
            </>
          )}
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
