"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/ui-store";

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useUIStore((s) => s.isOverlayOpen);
  const closeAll = useUIStore((s) => s.closeAll);

  return (
    <>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-45"
            onClick={closeAll}
          />
        )}
      </AnimatePresence>
    </>
  );
}