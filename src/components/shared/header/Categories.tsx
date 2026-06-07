"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { CATEGORIES, CATEGORY_FOOTER_LINKS } from "@/lib/constants";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

type CategoryProps = {
  className?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.04 },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2, ease: "easeIn" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const Categories = ({ className }: CategoryProps) => {
  const subLinkClass = cn(
    "block px-2 py-1.5 text-sm font-light text-muted-foreground",
    "hover:text-foreground hover:bg-muted",
    "transition-colors duration-150 ease-in-out",
  );

  const mainLinkClass = cn(
    "block px-2 py-1.5 mb-1 text-sm font-semibold",
    "hover:text-primary transition-colors duration-150 ease-in-out",
  );

  const footerLinkClass = cn(
    "inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium",
    "hover:text-primary hover:bg-muted",
    "transition-colors duration-150 ease-in-out group",
  );

  const activePanel = useUIStore((s) => s.activePanel);
  const closeAll = useUIStore((s) => s.closeAll);

  const open = activePanel === "categories";

  return (
    <div
      className={cn(
        "absolute top-[calc(100%+16px)] left-0 w-fit min-w-[50svw]",
        "bg-background border border-border/60 shadow-xl p-6 z-50",
        className,
        !open && "hidden",
      )}
    >
      <AnimatePresence mode="wait">
        {open && (
          <React.Fragment key="categories-panel">
            <motion.div
              key="categories"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-4 gap-x-6 gap-y-8 w-full"
            >
              {CATEGORIES.map((c, _id) => (
                <motion.div key={_id} variants={itemVariants}>
                  <Link
                    className={mainLinkClass}
                    href={c.href}
                    onClick={closeAll}
                  >
                    {c.name}
                  </Link>
                  <div className="flex flex-col gap-0.5">
                    {c.items.map((subc) => (
                      <Link
                        key={subc.href}
                        href={subc.href}
                        className={subLinkClass}
                        onClick={closeAll}
                      >
                        {subc.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              key="categories-footer"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.2, duration: 0.2 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="flex flex-wrap gap-1 w-full mt-4 pt-4 border-t border-border/60"
            >
              {CATEGORY_FOOTER_LINKS.map((fc, _id) => (
                <Link
                  key={_id}
                  className={footerLinkClass}
                  href={fc.href}
                  onClick={closeAll}
                >
                  {fc.name}
                  <ChevronRight
                    size={12}
                    className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
                  />
                </Link>
              ))}
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
