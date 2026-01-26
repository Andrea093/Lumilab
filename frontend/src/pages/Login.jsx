import React from "react";
import { Link } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";

export default function Login() {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      
      <div className="flex flex-col items-center text-center px-6">

        {/* LOGO */}
        <img
          src={logoLumilab}
          alt="Lumilab"
          className="w-[320px] max-w-full h-auto mb-5"
        />

        {/* SLOGAN */}
        <p className="text-lg text-violet-800 font-semibold mb-6">
          Cuando enseñar se toca, se escucha y se siente
        </p>

        {/* CTA */}
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-10 py-4 rounded-2xl 
                     bg-gradient-to-r from-violet-600 to-pink-500 
                     text-white text-lg font-semibold 
                     shadow-lg hover:scale-105 transition-transform"
        >
          entrar 
        </Link>

        {/* MICRO COPY */}
        <p className="text-sm text-gray-500 mt-5">
          Simuladores interactivos de física multisensorial
        </p>

      </div>
    </div>
  );
}
