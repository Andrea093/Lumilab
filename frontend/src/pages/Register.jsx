import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLumilab from "../assets/logo-lumilab.png";
import { useAuth } from "../context/AuthContext";

const GRADES = [6, 7, 8, 9, 10, 11];

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    grade: "",
    documentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (form.password !== form.confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register({
        fullName: form.fullName,
        grade: form.grade,
        documentId: form.documentId,
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard");
    } catch {
      // el error del servidor ya queda expuesto por el contexto de autenticación
    }
  };

  const displayedError = formError || error;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <img
          src={logoLumilab}
          alt="Logotipo de Lumilab"
          className="w-[220px] max-w-full h-auto mb-4"
        />

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/80 rounded-2xl shadow-lg p-6 text-left space-y-4"
          aria-describedby={displayedError ? "register-error" : undefined}
        >
          <h1 className="text-xl font-bold text-violet-800 text-center">
            Inscripción de estudiante
          </h1>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={update("fullName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
              Grado
            </label>
            <select
              id="grade"
              name="grade"
              required
              value={form.grade}
              onChange={update("grade")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            >
              <option value="" disabled>
                Selecciona tu grado
              </option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}°
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="documentId" className="block text-sm font-medium text-gray-700 mb-1">
              Número de documento
            </label>
            <input
              id="documentId"
              name="documentId"
              type="text"
              autoComplete="off"
              required
              value={form.documentId}
              onChange={update("documentId")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico (opcional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
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
              autoComplete="new-password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
            />
          </div>

          {displayedError && (
            <p id="register-error" role="alert" className="text-sm text-red-600">
              {displayedError}
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
            {loading ? "Inscribiendo…" : "Inscribirme"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-violet-700 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
