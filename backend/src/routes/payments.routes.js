import { Router } from "express";
import crypto from "node:crypto";
import { requireAuth } from "../middleware/requireAuth.js";
import { env } from "../config/env.js";
import {
  createPayment,
  updatePaymentStatus,
  getPaymentByReference,
  hasPremiumAccess,
  grantPremiumAccess,
  listPremiumTopicIds,
} from "../models/premiumRepository.js";

export const paymentsRouter = Router();

// Estado premium del usuario actual, y lista de temas marcados como premium (para que
// el frontend sepa que bloquear). No requiere ser admin, cualquier cuenta con sesion
// necesita saber esto para navegar la app.
paymentsRouter.get("/status", requireAuth, async (req, res, next) => {
  try {
    const [hasPremium, premiumTopicIds] = await Promise.all([
      hasPremiumAccess(req.user.id),
      listPremiumTopicIds(),
    ]);
    res.json({ hasPremium, premiumTopicIds });
  } catch (err) {
    next(err);
  }
});

paymentsRouter.post("/create", requireAuth, async (req, res, next) => {
  try {
    if (!env.wompiPublicKey || !env.wompiIntegritySecret) {
      return res.status(503).json({ error: "Los pagos todavia no estan configurados." });
    }

    const amountInCents = env.premiumPriceCop * 100;
    const reference = `lumilab-${req.user.id}-${Date.now()}`;
    await createPayment(req.user.id, reference, amountInCents);

    const signaturePayload = `${reference}${amountInCents}COP${env.wompiIntegritySecret}`;
    const signature = crypto.createHash("sha256").update(signaturePayload).digest("hex");

    res.json({
      publicKey: env.wompiPublicKey,
      currency: "COP",
      amountInCents,
      reference,
      signature,
      redirectUrl: `${env.appUrl}/pago/resultado`,
    });
  } catch (err) {
    next(err);
  }
});

// Consulta directa a Wompi por si el webhook todavia no llego (evita que el usuario se
// quede viendo "confirmando" sin necesidad tras completar el pago). La API de sandbox y
// la de produccion son hosts distintos; se elige segun el prefijo de la llave publica
// (pub_test_ = sandbox) para no consultar el ambiente equivocado durante pruebas.
paymentsRouter.get("/verify/:transactionId", requireAuth, async (req, res, next) => {
  try {
    if (!env.wompiPrivateKey) {
      return res.status(503).json({ error: "Verificacion no configurada." });
    }
    const isSandbox = env.wompiPublicKey?.startsWith("pub_test_");
    const apiBase = isSandbox ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";
    const wompiRes = await fetch(`${apiBase}/transactions/${req.params.transactionId}`, {
      headers: { Authorization: `Bearer ${env.wompiPrivateKey}` },
    });
    const body = await wompiRes.json();
    const transaction = body?.data;
    if (!transaction) {
      return res.status(404).json({ error: "Transaccion no encontrada." });
    }

    await updatePaymentStatus(transaction.reference, transaction.status, transaction.id);
    if (transaction.status === "APPROVED") {
      const payment = await getPaymentByReference(transaction.reference);
      if (payment) await grantPremiumAccess(payment.user_id);
    }

    res.json({ status: transaction.status });
  } catch (err) {
    next(err);
  }
});

// Wompi llama esta ruta directamente (no pasa por requireAuth: la autenticidad se valida
// con el checksum, no con un token de sesion nuestro).
paymentsRouter.post("/webhook", async (req, res, next) => {
  try {
    const event = req.body;
    if (!env.wompiEventsSecret || !event?.signature?.properties || !event?.data) {
      return res.status(400).json({ error: "Evento invalido." });
    }

    const getValue = (path) => path.split(".").reduce((obj, key) => obj?.[key], event.data);
    const concatenated =
      event.signature.properties.map((p) => String(getValue(p) ?? "")).join("") +
      String(event.timestamp ?? "") +
      env.wompiEventsSecret;
    const checksum = crypto.createHash("sha256").update(concatenated).digest("hex").toUpperCase();

    if (checksum !== String(event.signature.checksum).toUpperCase()) {
      return res.status(401).json({ error: "Firma invalida." });
    }

    const transaction = event.data.transaction;
    if (transaction?.reference) {
      await updatePaymentStatus(transaction.reference, transaction.status, transaction.id);
      if (transaction.status === "APPROVED") {
        const payment = await getPaymentByReference(transaction.reference);
        if (payment) await grantPremiumAccess(payment.user_id);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
