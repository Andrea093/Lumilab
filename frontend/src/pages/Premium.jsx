import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePremium } from "../context/PremiumContext";
import { api } from "../lib/api";
import LumiGuide from "../components/LumiGuide";

export default function Premium() {
  const { token } = useAuth();
  const { hasPremium } = usePremium();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.createPayment(token);
      const form = document.createElement("form");
      form.method = "GET";
      form.action = "https://checkout.wompi.co/p/";
      const fields = {
        "public-key": data.publicKey,
        currency: data.currency,
        "amount-in-cents": data.amountInCents,
        reference: data.reference,
        "signature:integrity": data.signature,
        "redirect-url": data.redirectUrl,
      };
      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-800 mb-2">Lumilab Premium</h1>
          <p className="text-gray-600">Desbloquea los temas marcados como premium, para siempre.</p>
        </div>

        <div className="mb-6">
          <LumiGuide
            greeting="Hola, soy Lumi. Aquí puedes activar el acceso premium para desbloquear contenido adicional."
            text="Esta es la página de Lumilab Premium."
          />
        </div>

        {hasPremium ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center">
            <p className="text-emerald-800 font-semibold text-lg">✓ Ya tienes acceso premium activado.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-700 mb-4">
              Un pago único desbloquea todo el contenido premium en tu cuenta, para siempre.
            </p>
            {error && (
              <p role="alert" className="text-red-600 mb-4">
                {error}
              </p>
            )}
            <button
              onClick={handlePay}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-60"
            >
              {loading ? "Conectando con Wompi…" : "Pagar con Wompi"}
            </button>
            <p className="text-xs text-gray-500 mt-3">Pago seguro procesado por Wompi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
