import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../lib/api";

const PremiumContext = createContext(null);

export function PremiumProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [premiumTopicIds, setPremiumTopicIds] = useState([]);

  const refresh = useCallback(() => {
    if (!isAuthenticated || !token) return;
    api
      .getPremiumStatus(token)
      .then((data) => {
        setHasPremium(!!data.hasPremium);
        setPremiumTopicIds(data.premiumTopicIds || []);
      })
      .catch(() => {
        // si falla, se asume sin premium en vez de romper la navegacion
      });
  }, [token, isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isTopicLocked = (topicId) => premiumTopicIds.includes(topicId) && !hasPremium;

  return (
    <PremiumContext.Provider value={{ hasPremium, premiumTopicIds, isTopicLocked, refresh }}>
      {children}
    </PremiumContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium debe usarse dentro de <PremiumProvider>");
  return ctx;
}
