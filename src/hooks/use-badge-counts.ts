// hooks/use-badge-counts.ts
"use client";

import { useState } from "react";

/**
 * Temporary local state — swap each `useState` for your Zustand selectors
 * once the store is wired up.
 *
 * Example Zustand migration:
 *   const cart = useCartStore((s) => s.items.length);
 */
export function useBadgeCounts() {
  const [cart] = useState(0);
  const [wishlist] = useState(0);
  const [notification] = useState(0);

  return {
    cart,
    wishlist,
    notification,
    // search results badge lives inside the search panel, not the nav icon
  } as const;
}

export type BadgeCountKey = keyof ReturnType<typeof useBadgeCounts>;