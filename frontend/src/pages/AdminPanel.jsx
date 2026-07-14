import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import LumiGuide from "../components/LumiGuide";
import { topics } from "../data/topics";

const ROLE_LABELS = {
  student: "Estudiante",
  teacher: "Docente",
  admin: "Administrador",
};

function CreateTeacherForm({ token, onCreated }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", documentId: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.createTeacher(token, form);
      setForm({ fullName: "", email: "", password: "", documentId: "" });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-5 mb-8">
      <h2 className="text-lg font-bold text-purple-700 mb-3">Crear cuenta docente</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="new-teacher-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            id="new-teacher-name"
            required
            value={form.fullName}
            onChange={update("fullName")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="new-teacher-email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo
          </label>
          <input
            id="new-teacher-email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="new-teacher-password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="new-teacher-password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update("password")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="new-teacher-document" className="block text-sm font-medium text-gray-700 mb-1">
            Documento (opcional)
          </label>
          <input
            id="new-teacher-document"
            value={form.documentId}
            onChange={update("documentId")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 mt-3">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 rounded-xl bg-violet-700 text-white font-semibold disabled:opacity-60"
      >
        {loading ? "Creando…" : "Crear docente"}
      </button>
    </form>
  );
}

function PremiumTopicsManager({ token }) {
  const [premiumIds, setPremiumIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .getAdminPremiumTopics(token)
      .then((data) => setPremiumIds(data.topicIds || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const toggle = async (topicId, currentlyPremium) => {
    setBusyId(topicId);
    setError(null);
    try {
      await api.setTopicPremium(token, topicId, !currentlyPremium);
      setPremiumIds((prev) =>
        currentlyPremium ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-8">
      <h2 className="text-lg font-bold text-purple-700 mb-1">Contenido premium</h2>
      <p className="text-sm text-gray-500 mb-3">
        Marca qué temas requieren el pago de Lumilab Premium para verse.
      </p>
      {loading && <p className="text-gray-600 text-sm">Cargando…</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600 mb-2">
          {error}
        </p>
      )}
      <div className="max-h-80 overflow-y-auto divide-y">
        {topics.map((topic) => {
          const isPremium = premiumIds.includes(topic.id);
          return (
            <label key={topic.id} className="flex items-center justify-between gap-3 py-2 cursor-pointer">
              <span className="text-sm text-gray-800">{topic.title}</span>
              <input
                type="checkbox"
                checked={isPremium}
                disabled={busyId === topic.id}
                onChange={() => toggle(topic.id, isPremium)}
                className="w-5 h-5 shrink-0"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

function UserRow({ user, token, onChanged, onDeleted, currentUserId }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user.full_name,
    grade: user.grade ?? "",
    documentId: user.document_id ?? "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const saveProfile = async () => {
    setError(null);
    setBusy(true);
    try {
      await api.updateAdminUser(token, user.id, form);
      setStatus("Datos actualizados.");
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await api.resetUserPassword(token, user.id, newPassword);
      setStatus("Contraseña restablecida.");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    try {
      await api.deleteUser(token, user.id);
      onDeleted?.(user.full_name);
      onChanged();
    } catch (err) {
      setError(err.message);
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-800">
            {user.full_name}{" "}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 ml-1">
              {ROLE_LABELS[user.role] || user.role}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {user.grade ? `${user.grade}°` : "Sin grado"} · {user.document_id || "sin documento"}
            {user.email ? ` · ${user.email}` : ""}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setEditing((v) => !v)}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold"
          >
            {editing ? "Cerrar" : "Editar / contraseña"}
          </button>
          {user.id !== currentUserId && (
            <button
              onClick={handleDelete}
              disabled={busy}
              className={`px-3 py-1 rounded-full font-semibold ${
                confirmDelete ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {confirmDelete ? "¿Confirmar eliminar?" : "Eliminar"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 mt-3">
          {error}
        </p>
      )}
      {status && !editing && (
        <p role="status" className="text-sm text-emerald-700 mt-3">
          {status}
        </p>
      )}

      {editing && (
        <div className="mt-4 border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Grado</label>
              <input
                type="number"
                min={6}
                max={11}
                value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Documento</label>
              <input
                value={form.documentId}
                onChange={(e) => setForm((f) => ({ ...f, documentId: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={busy}
            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-semibold disabled:opacity-60"
          >
            Guardar datos
          </button>

          <div className="flex flex-wrap items-end gap-2 pt-2 border-t">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nueva contraseña</label>
              <input
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <button
              onClick={resetPassword}
              disabled={busy}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              Restablecer contraseña
            </button>
          </div>

          {status && (
            <p role="status" className="text-sm text-emerald-700">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState("");

  const handleDeleted = (name) => {
    setDeletedMessage(`✓ Cuenta eliminada: ${name}.`);
  };

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .getAdminUsers(token)
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-800 mb-2">Administración</h1>
          <p className="text-gray-600">
            Restablece contraseñas, edita datos de cualquier usuario, y crea o elimina cuentas.
          </p>
        </div>

        <div className="mb-6">
          <LumiGuide
            greeting="Hola, soy Lumi. Aquí puedes restablecer contraseñas, editar datos de cualquier usuario, y crear o eliminar cuentas."
            text="Este es el panel de administración de Lumilab."
          />
        </div>

        <CreateTeacherForm token={token} onCreated={load} />
        <PremiumTopicsManager token={token} />

        {loading && <p className="text-gray-600">Cargando usuarios…</p>}
        {error && (
          <p role="alert" className="text-red-600 mb-4">
            {error}
          </p>
        )}
        {deletedMessage && (
          <p role="status" className="text-emerald-700 font-medium mb-4">
            {deletedMessage}
          </p>
        )}

        <div className="space-y-3">
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              token={token}
              onChanged={load}
              onDeleted={handleDeleted}
              currentUserId={currentUser?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
