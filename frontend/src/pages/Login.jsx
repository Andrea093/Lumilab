import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ identifier, password });
      navigate("/dashboard");
    } catch {
      // el error ya queda expuesto en el contexto de autenticación
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <img
          src={logoLumilab}
          alt="Logotipo de Lumilab"
          className="w-[260px] max-w-full h-auto mb-4"
        />

        <p className="text-lg text-violet-800 font-semibold mb-6">
          Cuando enseñar se toca, se escucha y se siente
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/80 rounded-2xl shadow-lg p-6 text-left space-y-4"
          aria-describedby={error ? "login-error" : undefined}
        >
          <h1 className="text-xl font-bold text-violet-800 text-center">
            Iniciar sesión
          </h1>

          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Documento o correo electrónico
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-violet-600 to-pink-500
                       text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-5">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" className="text-violet-700 font-semibold hover:underline">
            Inscríbete aquí
          </Link>
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Simuladores interactivos de física multisensorial
        </p>
      </div>
    </div>
  );
}
