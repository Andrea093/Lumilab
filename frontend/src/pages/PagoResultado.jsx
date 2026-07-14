import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePremium } from "../context/PremiumContext";
import { api } from "../lib/api";

const STATUS_LABELS = {
  APPROVED: { text: "¡Pago aprobado! Tu acceso premium ya está activo.", className: "text-emerald-700" },
  DECLINED: { text: "El pago fue rechazado. Puedes intentar de nuevo.", className: "text-red-600" },
  VOIDED: { text: "El pago fue anulado.", className: "text-red-600" },
  ERROR: { text: "Hubo un error con el pago. Intenta de nuevo.", className: "text-red-600" },
  PENDING: { text: "Tu pago está siendo procesado…", className: "text-amber-700" },
};

export default function PagoResultado() {
  const { token } = useAuth();
  const { refresh } = usePremium();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("id");
  const [status, setStatus] = useState(transactionId ? "PENDING" : null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!transactionId) return;
    api
      .verifyPayment(token, transactionId)
      .then((data) => {
        setStatus(data.status);
        if (data.status === "APPROVED") refresh();
      })
      .catch((err) => setError(err.message));
  }, [transactionId, token, refresh]);

  const info = status ? STATUS_LABELS[status] || STATUS_LABELS.ERROR : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-violet-800 mb-4">Resultado del pago</h1>
        {!transactionId && <p className="text-gray-600">No se encontró información de ningún pago.</p>}
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
        {info && <p className={`font-semibold ${info.className}`}>{info.text}</p>}
        <Link to="/dashboard" className="inline-block mt-6 text-violet-700 font-semibold hover:underline">
          ← Volver al panel
        </Link>
      </div>
    </div>
  );
}
