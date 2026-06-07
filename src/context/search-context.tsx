"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SearchPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SearchPanelContext = createContext<SearchPanelContextValue | null>(null);

export function SearchPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <SearchPanelContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SearchPanelContext.Provider>
  );
}

export function useSearchPanel() {
  const ctx = useContext(SearchPanelContext);
  if (!ctx) throw new Error("useSearchPanel must be used inside <SearchPanelProvider>");
  return ctx;
}