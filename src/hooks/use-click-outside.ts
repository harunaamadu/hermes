// hooks/use-click-outside.ts
import { useEffect, RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T> | RefObject<T>[],
  handler: (e: MouseEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const refArray = Array.isArray(refs) ? refs : [refs];

    const listener = (e: MouseEvent) => {
      const isInside = refArray.some(
        (ref) => ref.current?.contains(e.target as Node),
      );
      if (isInside) return;
      handler(e);
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [refs, handler, enabled]);
}