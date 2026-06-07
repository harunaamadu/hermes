// components/shared/header/NavBadge.tsx

import { ClientOnly } from "@/components/common/OnlyClient";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface NavBadgeProps {
  variant: "count" | "dot";
  count?: number;
  className?: string;
}

/**
 * Sharp-edged badge for nav icons.
 * variant="count" — shows a number (hidden when count is 0).
 * variant="dot"   — shows a filled dot (hidden when count is 0).
 */
const NavBadge = ({ variant, count = 0, className }: NavBadgeProps) => {
  if (count === 0) return null;

  if (variant === "dot") {
    return (
      <AnimatePresence mode="wait">
        <ClientOnly>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.2, duration: 0.2 },
            }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.15 } }}
            aria-hidden="true"
            className={cn(
              "absolute -right-0.5 -top-0.5 size-2 bg-destructive rounded-full",
              className,
            )}
          />
        </ClientOnly>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <ClientOnly>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { delay: 0.2, duration: 0.2 },
          }}
          exit={{ opacity: 0, scale: 0, transition: { duration: 0.15 } }}
          aria-hidden="true" // the aria-label on the parent button carries the count for a11y
          className={cn(
            "absolute -right-3 -top-3 flex min-w-4.5 aspect-square items-center justify-center",
            "bg-foreground px-0.5 py-px",
            "text-[8px] font-bold leading-none tracking-wide text-background",
            className,
          )}
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      </ClientOnly>
    </AnimatePresence>
  );
};

export default NavBadge;
