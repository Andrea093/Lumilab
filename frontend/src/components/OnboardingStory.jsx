import React, { useEffect, useRef, useState } from "react";
import LumiCharacter from "./LumiCharacter";
import useLumi from "../hooks/useLumi";
import { normalizeAnswer } from "../utils/answer";

const SEEN_KEY = "lumilab_onboarding_seen";
const MIC_KEY = "lumilab_mic_primed";

export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

const STORY = [
  "Hace tiempo, en un laboratorio lleno de preguntas sin responder, nació una chispa de curiosidad. Le pusieron por nombre Lumi.",
  "Lumi se puso su bata, sus gafas de laboratorio, y descubrió algo importante: la física no solo se ve, también se escucha y se siente. El sonido de una caída, el pulso de una onda, la vibración de una rueda que gira.",
  "Desde entonces, Lumi acompaña cada experimento de Lumilab, contando lo que pasa con su voz, para que nadie se quede afuera de la ciencia por no poder verla.",
  "Yo soy Lumi, y voy a estar contigo en cada simulación. Cuando quieras seguir, dime 'continuar', o toca el botón.",
];

const CONTINUE_WORDS = ["continu", "siguiente", "listo", "adelante", "ok", "vale", "si"];
const ACCEPT_WORDS = ["activ", "acept", "si", "listo", "ok"];
const DECLINE_WORDS = ["no", "despues", "ahora no", "luego"];

// Modal de bienvenida: se muestra una sola vez por dispositivo, después de iniciar sesión.
// Combina la historia de origen de Lumi (narrada, con su ilustración) y la solicitud única y
// accesible del permiso de micrófono, con opción de avanzar hablando o tocando botones.
export default function OnboardingStory({ onFinish }) {
  const { speak, stopSpeak, listen, isSpeaking, isListening } = useLumi();
  const [step, setStep] = useState("story");
  const [micStatus, setMicStatus] = useState("idle");
  const [voiceHint, setVoiceHint] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => speak(STORY.join(" ")), 300);
    return () => {
      clearTimeout(t);
      stopSpeak();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        finish();
        return;
      }
      if (e.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const finish = () => {
    stopSpeak();
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // localStorage puede no estar disponible (modo privado); no es crítico
    }
    onFinish?.();
  };

  const goToMicStep = () => {
    stopSpeak();
    setStep("mic");
    setVoiceHint("");
    setTimeout(
      () =>
        speak(
          "Ahora voy a pedirte permiso para usar el micrófono, solo una vez. Di 'activar', o toca el botón verde. Si prefieres no hacerlo ahora, di 'no'."
        ),
      200
    );
  };

  const requestMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus("unsupported");
      speak("Este navegador no admite reconocimiento de voz. Puedes seguir usando Lumilab escribiendo tus respuestas.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      try {
        localStorage.setItem(MIC_KEY, "granted");
      } catch {
        // no crítico si no se puede guardar la preferencia
      }
      setMicStatus("granted");
      speak("Listo. Tu micrófono ya quedó activado para siempre en este dispositivo.");
    } catch {
      try {
        localStorage.setItem(MIC_KEY, "denied");
      } catch {
        // no crítico si no se puede guardar la preferencia
      }
      setMicStatus("denied");
      speak(
        "No pasa nada. Puedes activar el micrófono más adelante desde el ícono de candado del navegador, o seguir escribiendo tus respuestas."
      );
    }
  };

  const handleVoiceError = () => {
    setVoiceHint("No pude escucharte. Puedes intentar de nuevo o usar los botones.");
  };

  const listenOnStory = () => {
    setVoiceHint("");
    listen((text) => {
      const n = normalizeAnswer(text);
      if (CONTINUE_WORDS.some((w) => n.includes(w))) {
        goToMicStep();
      } else {
        setVoiceHint(`Escuché "${text}". Di "continuar" cuando quieras seguir, o toca el botón.`);
      }
    }, handleVoiceError);
  };

  const listenOnMic = () => {
    setVoiceHint("");
    listen((text) => {
      const n = normalizeAnswer(text);
      if (DECLINE_WORDS.some((w) => n.includes(w))) {
        finish();
      } else if (ACCEPT_WORDS.some((w) => n.includes(w))) {
        requestMic();
      } else {
        setVoiceHint(`Escuché "${text}". Di "activar" para encender el micrófono, o "no" para continuar sin él.`);
      }
    }, handleVoiceError);
  };

  const avatarState = isListening ? "listening" : isSpeaking ? "talking" : "happy";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 text-left max-h-[92vh] overflow-y-auto"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <LumiCharacter
            height={140}
            state={avatarState}
            alt="Lumi, científica animada con bata de laboratorio y una tablet con el logo de un átomo, sonriendo y saludando"
            className="shrink-0"
          />
          <h2 id="onboarding-title" className="text-xl font-bold text-violet-800">
            {step === "story" ? "Conoce a Lumi" : "Activemos tu voz"}
          </h2>
        </div>

        {step === "story" ? (
          <>
            <div className="space-y-3 text-gray-700 text-sm">
              {STORY.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={() => speak(STORY.join(" "))}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold"
              >
                Escuchar de nuevo
              </button>
              <button onClick={stopSpeak} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                Parar
              </button>
              <button
                onClick={listenOnStory}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
              >
                <span aria-hidden="true">🎤</span> Responder por voz
              </button>
              <button
                onClick={goToMicStep}
                className="px-4 py-2 rounded-xl bg-violet-700 text-white font-semibold sm:ml-auto"
              >
                Continuar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 text-sm mb-4">
              Lumilab puede escuchar tus respuestas por voz en cada simulación. Actívalo una sola
              vez: tu navegador te pedirá el permiso y, después de eso, no volverá a preguntarte en
              este dispositivo.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={requestMic}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
              >
                Activar mi voz para siempre
              </button>
              <button
                onClick={listenOnMic}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
              >
                <span aria-hidden="true">🎤</span> Responder por voz
              </button>
              <button onClick={finish} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 sm:ml-auto">
                {micStatus === "granted" ? "Empezar a explorar" : "Ahora no, continuar sin voz"}
              </button>
            </div>
            {micStatus === "granted" && (
              <p role="status" className="mt-3 text-emerald-700 font-medium">
                ✓ Micrófono activado.
              </p>
            )}
            {micStatus === "denied" && (
              <p role="status" className="mt-3 text-amber-700 font-medium">
                Sin micrófono por ahora — puedes activarlo luego desde el ícono de candado del
                navegador.
              </p>
            )}
          </>
        )}

        <p aria-live="polite" className="mt-3 text-sm text-blue-700 min-h-[1.25em]">
          {voiceHint}
        </p>
      </div>
    </div>
  );
}
