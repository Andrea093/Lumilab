import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AccessibilityContext = createContext(null);

const STORAGE_KEY = "lumilab_accessibility";
const FONT_SCALES = [1, 1.15, 1.3, 1.5];

function loadInitialState() {
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const defaults = {
    fontScaleIndex: 0,
    highContrast: false,
    reduceMotion: prefersReducedMotion,
    audioDescriptionsAlwaysOn: false,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const root = document.documentElement;
    root.dataset.contrast = settings.highContrast ? "high" : "normal";
    root.dataset.motion = settings.reduceMotion ? "reduce" : "normal";
    root.style.setProperty("--font-scale", String(FONT_SCALES[settings.fontScaleIndex]));
  }, [settings]);

  const increaseFontScale = useCallback(() => {
    setSettings((s) => ({
      ...s,
      fontScaleIndex: Math.min(s.fontScaleIndex + 1, FONT_SCALES.length - 1),
    }));
  }, []);

  const decreaseFontScale = useCallback(() => {
    setSettings((s) => ({ ...s, fontScaleIndex: Math.max(s.fontScaleIndex - 1, 0) }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings((s) => ({ ...s, highContrast: !s.highContrast }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }));
  }, []);

  const toggleAudioDescriptions = useCallback(() => {
    setSettings((s) => ({ ...s, audioDescriptionsAlwaysOn: !s.audioDescriptionsAlwaysOn }));
  }, []);

  const value = {
    fontScale: FONT_SCALES[settings.fontScaleIndex],
    canIncreaseFontScale: settings.fontScaleIndex < FONT_SCALES.length - 1,
    canDecreaseFontScale: settings.fontScaleIndex > 0,
    highContrast: settings.highContrast,
    reduceMotion: settings.reduceMotion,
    audioDescriptionsAlwaysOn: settings.audioDescriptionsAlwaysOn,
    increaseFontScale,
    decreaseFontScale,
    toggleHighContrast,
    toggleReduceMotion,
    toggleAudioDescriptions,
  };

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility debe usarse dentro de <AccessibilityProvider>");
  return ctx;
}
