// components/providers/overlay-provider.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type OverlayContextValue = {
  showOverlay: () => void;
  hideOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const showOverlay = useCallback(() => setCount((n) => n + 1), []);
  const hideOverlay = useCallback(() => setCount((n) => Math.max(0, n - 1)), []);

  return (
    <OverlayContext.Provider value={{ showOverlay, hideOverlay }}>
      {children}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used within <OverlayProvider>");
  return ctx;
}