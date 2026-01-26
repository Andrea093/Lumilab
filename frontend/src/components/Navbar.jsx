import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);

  const closeAll = () => {
    setMenuOpen(false);
    setSimOpen(false);
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
            className="w-36 md:w-52 h-auto object-contain"
          />

          {/* SLOGAN SOLO EN DESKTOP */}
          <div className="hidden md:block leading-tight">
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
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">

          {/* SIMULADORES */}
          <div className="relative">
            <button
              onClick={() => setSimOpen(!simOpen)}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-1"
            >
              Simuladores ▾
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
        </nav>
      </div>

      {/* NAV MOBILE */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          
          <button
            onClick={() => setSimOpen(!simOpen)}
            className="w-full text-left font-semibold text-gray-800"
          >
            Simuladores ▾
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
    </>
  );
}
