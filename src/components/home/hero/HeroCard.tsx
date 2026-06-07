"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────

type CardVariant = "portrait" | "landscape" | "square";

type CardProps = {
  id?: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  /** Number of items / pieces in the collection  */
  itemCount?: number;
  /** Optional accent colour for the hover underline & badge */
  accent?: string;
  variant?: CardVariant;
  className?: string;
  /** Index used for staggered entrance animation */
  index?: number;
};

// ─── Dummy data export (ready to map) ──────────────────────────────────────────

export const HERO_CARDS: Omit<CardProps, "className">[] = [
  {
    id: "gadgets",
    title: "Gadgets",
    subtitle: "Next-Gen Tech",
    href: "/shop/gadgets",
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=700&q=80&auto=format&fit=crop",
    itemCount: 183,
    accent: "#38bdf8",
    variant: "landscape",
    index: 0,
  },
  {
    id: "home-decor",
    title: "Home Decor",
    subtitle: "Curated Spaces",
    href: "/shop/home-decor",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80&auto=format&fit=crop",
    itemCount: 274,
    accent: "#fbbf24",
    variant: "portrait",
    index: 1,
  },
  {
    id: "beauty",
    title: "Beauty",
    subtitle: "Skin & Glow",
    href: "/shop/beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80&auto=format&fit=crop",
    itemCount: 156,
    accent: "#f472b6",
    variant: "portrait",
    index: 2,
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "Peak Performance",
    href: "/shop/sports",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=700&q=80&auto=format&fit=crop",
    itemCount: 211,
    accent: "#4ade80",
    variant: "landscape",
    index: 3,
  },
  {
    id: "books",
    title: "Books",
    subtitle: "Worlds Await",
    href: "/shop/books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=80&auto=format&fit=crop",
    itemCount: 492,
    accent: "#fb923c",
    variant: "square",
    index: 4,
  },
  {
    id: "food",
    title: "Food & Drink",
    subtitle: "Artisan Picks",
    href: "/shop/food",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80&auto=format&fit=crop",
    itemCount: 138,
    accent: "#a78bfa",
    variant: "square",
    index: 5,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

const HeroCard = ({
  id,
  title,
  subtitle,
  href,
  image,
  itemCount,
  accent = "#ffffff",
  variant = "portrait",
  className,
  index = 0,
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle 3-D tilt on mouse move
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Suppress aspect ratio when caller provides an explicit height (e.g. "h-full")
  const hasExplicitHeight = className?.includes("h-") ?? false;
  const sizeClass = hasExplicitHeight ? "" : (
    variant === "landscape" ? "aspect-[16/9]" :
    variant === "square"    ? "aspect-square"  :
                              "aspect-[3/4]"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
      className={cn(hasExplicitHeight && "h-full min-h-0")}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative overflow-hidden bg-neutral-900 cursor-pointer",
          sizeClass,
          hasExplicitHeight && "h-full w-full",
          className,
        )}
      >
        {/* ── Image ──────────────────────────────────────────── */}
        {image && (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top"
              priority={index < 2}
            />
          </motion.div>
        )}

        {/* ── Gradient overlay ───────────────────────────────── */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* ── Accent overlay flash on hover ──────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${accent}18 0%, transparent 60%)` }}
        />

        {/* ── Item-count badge ───────────────────────────────── */}
        {itemCount !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.12 + 0.3, duration: 0.4 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 backdrop-blur-sm bg-black/40 border"
            style={{ borderColor: `${accent}44` }}
          >
            <span className="w-1.5 h-1.5" style={{ backgroundColor: accent }} />
            <span
              className="text-[10px] text-neutral-50 font-semibold tracking-widest uppercase"
            >
              {itemCount} pieces
            </span>
          </motion.div>
        )}

        {/* ── Text block ─────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-6">
          {/* Subtitle slides up into view */}
          <motion.p
            className="text-xs font-medium tracking-[0.22em] uppercase mb-1 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
          >
            {subtitle}
          </motion.p>

          {/* Title */}
          <h3
            className="text-white font-heading font-black leading-none tracking-[-0.02em] mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4.2vw, 2.8rem)",
            }}
          >
            {title}
          </h3>

          {/* Thin accent line that expands on hover */}
          <motion.div
            className="h-px mb-4 origin-left"
            style={{ backgroundColor: accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* CTA row */}
          <Link
            href={href}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-bold tracking-wide text-white/80",
              "group-hover:text-white transition-colors duration-300",
            )}
            aria-label={`Shop ${title}`}
          >
            Shop Collection
            <motion.span
              className="inline-flex items-center justify-center w-7 h-7 border border-white/20 bg-white/5"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6H10M10 6L7 3M10 6L7 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroCard;


// ─── Demo grid (optional usage) ────────────────────────────────────────────────
//
// import HeroCard, { HERO_CARDS } from "@/components/shared/HeroCard";
//
// Responsive masonry-style grid — landscape cards span 2 cols on md+:
//
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
//   {HERO_CARDS.map((card) => (
//     <HeroCard
//       key={card.id}
//       {...card}
//       className={card.variant === "landscape" ? "sm:col-span-2 lg:col-span-2" : ""}
//     />
//   ))}
// </div>