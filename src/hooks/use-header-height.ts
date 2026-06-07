"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Measures the combined height of #announcement + #header and returns it.
 * Re-measures on resize so the search panel always fills the remaining viewport.
 */
export function useHeaderHeight() {
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    const announcement = document.getElementById("announcement");
    const header = document.getElementById("header");
    const total =
      (announcement?.offsetHeight ?? 0) + (header?.offsetHeight ?? 0);
    setHeight(total);
  }, []);

  useEffect(() => {
    measure();

    const observer = new ResizeObserver(measure);

    const announcement = document.getElementById("announcement");
    const header = document.getElementById("header");
    if (announcement) observer.observe(announcement);
    if (header) observer.observe(header);

    return () => observer.disconnect();
  }, [measure]);

  return height;
}