import React, { useEffect, useRef, useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const {
    canIncreaseFontScale,
    canDecreaseFontScale,
    increaseFontScale,
    decreaseFontScale,
    highContrast,
    toggleHighContrast,
    reduceMotion,
    toggleReduceMotion,
    audioDescriptionsAlwaysOn,
    toggleAudioDescriptions,
  } = useAccessibility();

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
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
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-1"
        title="Accesibilidad"
      >
        <span aria-hidden="true">♿</span>
        <span className="hidden sm:inline">Accesibilidad</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-panel-title"
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border p-5 z-50 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="accessibility-panel-title" className="font-bold text-violet-800 text-lg">
                Accesibilidad
              </h2>
              <button
                onClick={close}
                aria-label="Cerrar panel de accesibilidad"
                className="text-gray-500 hover:text-gray-800 px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="block font-medium text-gray-700 mb-1">Tamaño del texto</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontScale}
                    disabled={!canDecreaseFontScale}
                    aria-label="Disminuir tamaño del texto"
                    className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                  >
                    A−
                  </button>
                  <button
                    onClick={increaseFontScale}
                    disabled={!canIncreaseFontScale}
                    aria-label="Aumentar tamaño del texto"
                    className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                  >
                    A+
                  </button>
                </div>
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-700">Alto contraste</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-700">Reducir movimiento</span>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={toggleReduceMotion}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-gray-700">
                  Descripciones de audio siempre activas
                </span>
                <input
                  type="checkbox"
                  checked={audioDescriptionsAlwaysOn}
                  onChange={toggleAudioDescriptions}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
