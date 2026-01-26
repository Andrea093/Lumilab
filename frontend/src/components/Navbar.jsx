import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO + SLOGAN */}
        <Link
          to="/dashboard"
          onClick={closeMenu}
          className="flex items-center gap-4"
        >
          <img
            src={logoLumilab}
            alt="Lumilab"
            className="w-60 h-20 object-contain"
          />

          <div className="leading-tight">
            <div className="font-extrabold text-lg text-gray-900">
              Lumilab
            </div>
            <div className="text-xs text-violet-700 font-semibold tracking-wide">
              Cuando enseñar se toca, se escucha y se siente
            </div>
          </div>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-base text-gray-700 font-medium">

          {/* SIMULADORES */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-1"
            >
              Simuladores
              <span className="text-sm">▾</span>
            </button>

            {open && (
              <div className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-2">

                <Link
                  to="/mru"
                  onClick={closeMenu}
                  className="block px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  MRU
                  <span className="block text-xs text-gray-500">
                    Movimiento Rectilíneo Uniforme
                  </span>
                </Link>

                <Link
                  to="/mrua"
                  onClick={closeMenu}
                  className="block px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  MRUA
                  <span className="block text-xs text-gray-500">
                    Movimiento Rectilíneo Uniformemente Acelerado
                  </span>
                </Link>

                <Link
                  to="/mcu"
                  onClick={closeMenu}
                  className="block px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  MCU
                  <span className="block text-xs text-gray-500">
                    Movimiento Circular Uniforme
                  </span>
                </Link>

                <Link
                  to="/mcua"
                  onClick={closeMenu}
                  className="block px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  MCUA
                  <span className="block text-xs text-gray-500">
                    Movimiento Circular Uniformemente Acelerado
                  </span>
                </Link>

              </div>
            )}
          </div>

          {/* LINKS FIJOS */}
          <Link
            to="/laboratorio"
            onClick={closeMenu}
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Laboratorio
          </Link>

          <Link
            to="/nosotros"
            onClick={closeMenu}
            className="px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Nosotros
          </Link>
        </nav>
      </div>
    </header>
  );
}
