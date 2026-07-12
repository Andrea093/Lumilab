import React from "react";
import { Link } from "react-router-dom";
import LumiGuide from "../components/LumiGuide";
import { useAuth } from "../context/AuthContext";

function ToolCard({ to, icon, title, description, accent }) {
  return (
    <Link
      to={to}
      className={`group rounded-3xl p-8 shadow-md hover:shadow-xl transition flex flex-col ${accent}`}
    >
      <div className="text-5xl mb-4" aria-hidden="true">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-700 flex-1">{description}</p>
      <span className="inline-block mt-4 text-violet-700 font-semibold group-hover:underline">
        Entrar →
      </span>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* ENCABEZADO */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-violet-800 mb-2">
            {firstName ? `Hola, ${firstName}` : "Panel Lumilab"}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            ¿Qué quieres explorar hoy? Elige una herramienta para entrar.
          </p>
        </div>

        <div className="mb-8">
          <LumiGuide
            greeting={`Hola${firstName ? `, ${firstName}` : ""}. Soy Lumi. Elige el laboratorio para experimentar libremente, o los temas por grado si quieres seguir el orden del curso.`}
            text="Hola, soy Lumi. Elige una herramienta para empezar."
          />
        </div>

        {/* HERRAMIENTAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ToolCard
            to="/laboratorio"
            icon="🔬"
            title="Laboratorio"
            description="Explora todas las simulaciones libremente, con buscador y filtro por tema. Sin pasar por el orden de grados."
            accent="bg-gradient-to-br from-violet-100 to-pink-100 border border-violet-300"
          />
          <ToolCard
            to="/temas"
            icon="📚"
            title="Temas por grado"
            description="Recorre el currículo de física de 6° a 11°, alineado a los estándares del MEN, tema por tema."
            accent="bg-white border border-gray-200"
          />
          {isTeacher && (
            <ToolCard
              to="/panel-docente"
              icon="🧑‍🏫"
              title="Panel docente"
              description="Consulta el progreso de tus estudiantes, filtra por grado y exporta el reporte."
              accent="bg-white border border-gray-200"
            />
          )}
          {isAdmin && (
            <ToolCard
              to="/admin"
              icon="🛠️"
              title="Administración"
              description="Restablece contraseñas, edita datos de estudiantes y administra cuentas docentes."
              accent="bg-white border border-gray-200"
            />
          )}
        </div>
      </div>
    </div>
  );
}
