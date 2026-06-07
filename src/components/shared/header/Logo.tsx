"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const Logo = ({ className }: { className?: string }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className=""
    >
      <Link
        href="/"
        className={cn(
          "font-heading text-foreground text-2xl md:text-3xl font-bold select-none group",
          className,
        )}
      >
        Her
        <span className="group-hover:text-primary transition-colors">mes</span>
      </Link>
    </motion.div>
  );
};

export default Logo;
