import { create } from "zustand";

type UIState = {
  activePanel: null | "menu" | "categories" | "more";

  isOverlayOpen: boolean;

  openPanel: (panel: UIState["activePanel"]) => void;
  closePanel: () => void;

  closeAll: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  activePanel: null,
  isOverlayOpen: false,

  openPanel: (panel) =>
    set({
      activePanel: panel,
      isOverlayOpen: true,
    }),

  closePanel: () =>
    set({
      activePanel: null,
      isOverlayOpen: false,
    }),

  closeAll: () =>
    set({
      activePanel: null,
      isOverlayOpen: false,
    }),
}));