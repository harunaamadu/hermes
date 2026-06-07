"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  Variants,
} from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/use-device";

gsap.registerPlugin(useGSAP);

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlideData {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  image: {
    default: string;
    mobile?: string;
  };
  accent: string; // CSS colour used for gradient tint
  accentText: string; // Tailwind text colour class
  tag: string;
}

interface NavButtonProps {
  onClick: () => void;
  direction: "prev" | "next";
  disabled?: boolean;
}

interface ProgressBarProps {
  /** 0 – 1 */
  progress: number;
  accent: string;
}

interface SlideIndicatorProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
  accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES: SlideData[] = [
  {
    id: 0,
    category: "Men's Collection",
    title: "Sharp\nEdges",
    subtitle: "SS 2026",
    description:
      "Precision tailoring meets street-level confidence. Structured silhouettes built for those who move with purpose.",
    cta: "Shop Men",
    image: {
      default: "/images/hero/young-man-in-bright-fashion.jpg",
      mobile: "/images/hero/young-man-leans-on-wall.jpg",
    },
    accent: "#1a1a2e",
    accentText: "text-blue-400",
    tag: "NEW ARRIVALS",
  },
  {
    id: 1,
    category: "Women's Collection",
    title: "Fluid\nForms",
    subtitle: "SS 2026",
    description:
      "Draped in intention. Every cut speaks softly — and lands with extraordinary impact.",
    cta: "Shop Women",
    image: {
      default:
        "/images/hero/model-poses-casually-on-ride.jpg",
      mobile:
        "/images/hero/young-woman-on-ferris-wheel.jpg",
    },
    accent: "#2d1b2e",
    accentText: "text-rose-400",
    tag: "FEATURED",
  },
  {
    id: 2,
    category: "Kids' Collection",
    title: "Bold\nPlay",
    subtitle: "SS 2026",
    description:
      "Built for adventure, designed for joy. Durable, vivid, and free — just like they are.",
    cta: "Shop Kids",
    image: {
      default:
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&q=80&auto=format&fit=crop",
    },
    accent: "#1a2e1e",
    accentText: "text-emerald-400",
    tag: "BESTSELLERS",
  },
];

const AUTOPLAY_DURATION = 6000; // ms

// ─── Sub-components ───────────────────────────────────────────────────────────

const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  direction,
  disabled,
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.12)" }}
    whileTap={{ scale: 0.94 }}
    className={cn(
      "relative z-20 w-11 h-11 border border-white/20",
      "flex items-center justify-center bg-white/5 backdrop-blur-sm",
      "text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    )}
    aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={cn(direction === "prev" && "rotate-180")}
    >
      <path
        d="M6.5 4L11.5 9L6.5 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.button>
);

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, accent }) => (
  <div className="relative h-0.5 w-full bg-white/10 overflow-hidden">
    <motion.div
      className="absolute inset-y-0 left-0"
      style={{
        backgroundColor:
          accent === "#1a1a2e"
            ? "#60a5fa"
            : accent === "#2d1b2e"
              ? "#fb7185"
              : "#34d399",
      }}
      animate={{ width: `${progress * 100}%` }}
      transition={{ duration: 0.1, ease: "linear" }}
    />
  </div>
);

const SlideIndicator: React.FC<SlideIndicatorProps> = ({
  total,
  current,
  onSelect,
  accent,
}) => {
  const dotAccent =
    accent === "#1a1a2e"
      ? "#60a5fa"
      : accent === "#2d1b2e"
        ? "#fb7185"
        : "#34d399";
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onSelect(i)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${i + 1}`}
          className="relative w-2 h-2 overflow-hidden focus:outline-none"
          style={{
            backgroundColor:
              i === current ? dotAccent : "rgba(255,255,255,0.25)",
          }}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor:
              i === current ? dotAccent : "rgba(255,255,255,0.25)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [prev, setPrev] = useState<number>(-1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);

  const imageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const slide = SLIDES[current];
  const dotAccent =
    slide.accent === "#1a1a2e"
      ? "#60a5fa"
      : slide.accent === "#2d1b2e"
        ? "#fb7185"
        : "#34d399";

  // ── Slide transition via GSAP ──────────────────────────────────────────────

  useGSAP(
    () => {
      if (!imageRef.current) return;
      gsap.fromTo(
        imageRef.current,
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1, ease: "expo.out" },
      );
    },
    { dependencies: [current] },
  );

  useGSAP(
    () => {
      if (!bgRef.current) return;
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
      );
    },
    { dependencies: [current] },
  );

  // ── Autoplay RAF ───────────────────────────────────────────────────────────

  const tick = useCallback(
    (timestamp: number) => {
      if (isPaused) return;
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current + pausedAtRef.current;
      const p = Math.min(elapsed / AUTOPLAY_DURATION, 1);
      progressRef.current = p;
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        goTo((current + 1) % SLIDES.length, 1);
      }
    },
    [current, isPaused], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    setProgress(0);
    if (!isPaused) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [current, isPaused, tick]);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number, dir: 1 | -1) => {
      setPrev(current);
      setDirection(dir);
      setCurrent(index);
      startTimeRef.current = null;
      pausedAtRef.current = 0;
      progressRef.current = 0;
      setProgress(0);
    },
    [current],
  );

  const handlePrev = () => {
    const idx = (current - 1 + SLIDES.length) % SLIDES.length;
    goTo(idx, -1);
  };

  const handleNext = () => {
    const idx = (current + 1) % SLIDES.length;
    goTo(idx, 1);
  };

  // ── Framer Motion variants ─────────────────────────────────────────────────

  const textVariants: Variants = {
    hidden: (d: number) => ({
      y: d > 0 ? 40 : -40,
      opacity: 0,
    }),
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: number) => ({
      y: d > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const tagVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.15 } },
    exit: { opacity: 0, x: 12, transition: { duration: 0.3 } },
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      className="relative w-full h-full py-12 md:min-h-150 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background image ─────────────────────────────────── */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={`img-${current}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <>
              <Image
                src={slide.image.default}
                alt={slide.category}
                fill
                sizes="(min-width: 1024px) 340px"
                loading="eager"
                className={cn(
                    "object-cover object-top",
                    slide.image?.mobile === null ? "hidden" : "block"
                )}
              />

              {slide.image?.mobile && (
                <Image
                  src={slide.image.mobile}
                  alt={slide.category}
                  fill
                  sizes="(max-width: 1024px) 100vw"
                  loading="eager"
                  className="block lg:hidden object-cover object-top"
                />
              )}
            </>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Gradient overlays ─────────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, ${slide.accent}ee 0%, ${slide.accent}99 40%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />
      {/* Bottom vignette */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-linear-to-t from-black/80 via-transparent to-transparent" />
      {/* Left heavy vignette */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-linear-to-r from-black/60 to-transparent" />

      {/* ── Slide number watermark ────────────────────────────── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-2 pointer-events-none hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.span
            key={`num-${current}`}
            className="block font-heading font-black text-[11rem] leading-none text-white/4 tabular-nums"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            0{current + 1}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-14 px-6 md:px-14 lg:px-20 max-w-7xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`content-${current}`}
            className="flex flex-col gap-4"
          >
            {/* Tag pill */}
            <motion.div
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "inline-flex items-center gap-2 w-fit px-3 py-1 text-[10px] font-bold tracking-[0.2em]",
                "border backdrop-blur-md bg-white/5",
              )}
              style={{ borderColor: `${dotAccent}66`, color: dotAccent }}
            >
              <span
                className="w-1.5 h-1.5 animate-pulse"
                style={{ backgroundColor: dotAccent }}
              />
              {slide.tag}
            </motion.div>

            {/* Category */}
            <motion.p
              variants={textVariants}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-white/50 text-sm font-medium tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              transition={{ delay: 0.05 }}
            >
              {slide.category} · {slide.subtitle}
            </motion.p>

            {/* Big headline */}
            <motion.h1
              variants={textVariants}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-white font-black font-heading leading-[0.9] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 8rem)",
                whiteSpace: "pre-line",
              }}
              transition={{ delay: 0.08 }}
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={textVariants}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-md text-white/60 text-sm md:text-base leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              transition={{ delay: 0.12 }}
            >
              {slide.description}
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={textVariants}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.18 }}
            >
              <motion.button
                whileHover={{ scale: 1.04, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "mt-2 inline-flex items-center gap-3 px-7 py-3.5 text-sm font-bold tracking-wide",
                  "text-black transition-all",
                )}
                style={{ backgroundColor: dotAccent }}
              >
                {slide.cta}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom controls ───────────────────────────────────── */}
        <div className="mt-10 flex items-center gap-6">
          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <NavButton onClick={handlePrev} direction="prev" />
            <NavButton onClick={handleNext} direction="next" />
          </div>

          {/* Progress + indicators */}
          <div className="flex-1 flex flex-col gap-2.5">
            <ProgressBar progress={progress} accent={slide.accent} />
            <div className="flex items-center justify-between">
              <SlideIndicator
                total={SLIDES.length}
                current={current}
                onSelect={(i) => goTo(i, i > current ? 1 : -1)}
                accent={slide.accent}
              />
              <div
                className="flex items-center gap-1.5 text-white/30 text-xs tabular-nums"
              >
                <span style={{ color: dotAccent }} className="font-bold">
                  0{current + 1}
                </span>
                <span>/</span>
                <span>0{SLIDES.length}</span>
              </div>
            </div>
          </div>

          {/* Pause / Play */}
          <motion.button
            onClick={() => setIsPaused((p) => !p)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 border border-white/20 bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
          >
            {isPaused ? (
              /* Play icon */
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <path d="M3 2.5L11 7L3 11.5V2.5Z" />
              </svg>
            ) : (
              /* Pause icon */
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <rect x="3" y="2" width="3" height="10" rx="1" />
                <rect x="8" y="2" width="3" height="10" rx="1" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Right-side small slides panel (desktop) ──────────── */}
      <div className="absolute right-0 top-0 bottom-0 w-70 lg:w-85 z-10 hidden xl:flex flex-col justify-center gap-3 pr-8">
        {SLIDES.map((s, i) => {
          const isActive = i === current;
          const sDot =
            s.accent === "#1a1a2e"
              ? "#60a5fa"
              : s.accent === "#2d1b2e"
                ? "#fb7185"
                : "#34d399";
          return (
            <motion.button
              key={s.id}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              whileHover={{ x: -4 }}
              animate={{
                opacity: isActive ? 1 : 0.45,
                scale: isActive ? 1 : 0.96,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={cn(
                "relative overflow-hidden text-left transition-all",
                isActive ? "ring-1 ring-white/20" : "",
              )}
              style={{ height: isActive ? 160 : 100 }}
              aria-label={`Go to ${s.category}`}
            >
              <Image
                src={s.image.default}
                alt={s.category}
                fill
                sizes="340px"
                className="object-cover object-top"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${s.accent}ee, transparent)`,
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p
                  className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
                  style={{ color: sDot }}
                >
                  {s.tag}
                </p>
                <p
                  className="text-white text-sm font-bold leading-tight"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.category}
                </p>
              </div>
              {isActive && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 animate-pulse"
                  style={{ backgroundColor: sDot }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default HeroCarousel;
