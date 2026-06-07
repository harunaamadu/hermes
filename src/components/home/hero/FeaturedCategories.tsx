"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCard, { HERO_CARDS } from "./HeroCard";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

type CardId = string;

interface ScheduleState {
  /** The two card IDs currently featured */
  featured: [CardId, CardId];
  /** Timestamp (ms) when the next auto-rotation is due */
  nextRotationAt: number;
  /** When true, the pair was set manually and auto-rotation is paused */
  isManual: boolean;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "featured_categories_schedule";
const ROTATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Pick 2 distinct random IDs from the pool, excluding the current pair if possible */
function pickRandom(exclude: [CardId, CardId]): [CardId, CardId] {
  const pool = HERO_CARDS.map((c) => c.id as CardId);
  const candidates = pool.filter((id) => !exclude.includes(id));
  // If the pool has fewer than 2 others (shouldn't happen with 6 cards) fall back to full pool
  const source = candidates.length >= 2 ? candidates : pool;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function loadState(): ScheduleState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScheduleState) : null;
  } catch {
    return null;
  }
}

function saveState(state: ScheduleState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initState(): ScheduleState {
  const saved = loadState();
  if (saved) return saved;
  const featured = pickRandom(["", ""] as [CardId, CardId]);
  return { featured, nextRotationAt: Date.now() + ROTATION_MS, isManual: false };
}

function calcTimeLeft(nextRotationAt: number): TimeLeft {
  const diff = Math.max(0, nextRotationAt - Date.now());
  const totalSec = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSec / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Countdown display ─────────────────────────────────────────────────────────

const Countdown: React.FC<{ nextRotationAt: number; isManual: boolean }> = ({
  nextRotationAt,
  isManual,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(nextRotationAt));

  useEffect(() => {
    if (isManual) return;
    const id = setInterval(() => setTimeLeft(calcTimeLeft(nextRotationAt)), 1000);
    return () => clearInterval(id);
  }, [nextRotationAt, isManual]);

  if (isManual) {
    return (
      <span
        className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30"
      >
        Manual Override Active
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white/30 text-[10px] tracking-widest uppercase">Next rotation</span>
      <span className="text-white/60 text-xs font-bold tabular-nums">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </div>
  );
};

// ─── Manual picker modal ───────────────────────────────────────────────────────

interface PickerProps {
  current: [CardId, CardId];
  onConfirm: (pair: [CardId, CardId]) => void;
  onClose: () => void;
}

const ManualPicker: React.FC<PickerProps> = ({ current, onConfirm, onClose }) => {
  const [selected, setSelected] = useState<CardId[]>([...current]);

  const toggle = (id: CardId) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length < 2) return [...prev, id];
      // Replace the oldest selection
      return [prev[1], id];
    });
  };

  const canConfirm = selected.length === 2;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl"
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2
              className="text-white font-heading font-black text-2xl leading-none mb-1"
            >
              Choose Featured Categories
            </h2>
            <p
              className="text-white/40 text-xs"
            >
              Select exactly 2 — they'll replace the current pair immediately.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors ml-4 mt-0.5"
            aria-label="Close picker"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 4L14 14M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {HERO_CARDS.map((card) => {
            const id = card.id as CardId;
            const isSelected = selected.includes(id);
            const selIndex = selected.indexOf(id);
            return (
              <motion.button
                key={id}
                onClick={() => toggle(id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative overflow-hidden rounded-xl aspect-4/3 text-left border-2 transition-colors duration-200",
                  isSelected ? "border-white/60" : "border-white/10 hover:border-white/25",
                )}
                aria-pressed={isSelected}
                aria-label={`Select ${card.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Accent tint when selected */}
                {isSelected && (
                  <div
                    className="absolute inset-0"
                    style={{ background: `${card.accent}25` }}
                  />
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p
                    className="text-white font-black text-base leading-none"
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-white/40 text-[10px] tracking-wider uppercase"
                  >
                    {card.subtitle}
                  </p>
                </div>

                {/* Selection badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-bold"
                      style={{ backgroundColor: card.accent }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      {selIndex + 1}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-white/30 text-xs"
          >
            {selected.length}/2 selected
          </p>
          <div className="flex gap-2">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-full text-sm font-medium text-white/50 border border-white/10 hover:border-white/25 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={() => canConfirm && onConfirm(selected as [CardId, CardId])}
              disabled={!canConfirm}
              whileHover={canConfirm ? { scale: 1.04 } : {}}
              whileTap={canConfirm ? { scale: 0.97 } : {}}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all",
                canConfirm
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/25 cursor-not-allowed",
              )}
            >
              Apply
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main section ──────────────────────────────────────────────────────────────

const FeaturedCategories: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleState | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setSchedule(initState());
  }, []);

  // Auto-rotation ticker: checks every minute if 24h has elapsed
  useEffect(() => {
    if (!schedule || schedule.isManual) return;

    const check = () => {
      if (Date.now() >= schedule.nextRotationAt) {
        const featured = pickRandom(schedule.featured);
        const next: ScheduleState = {
          featured,
          nextRotationAt: Date.now() + ROTATION_MS,
          isManual: false,
        };
        saveState(next);
        setSchedule(next);
      }
    };

    check(); // immediate check on mount / state change
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [schedule]);

  // Persist whenever state changes
  useEffect(() => {
    if (schedule) saveState(schedule);
  }, [schedule]);

  const handleManualConfirm = useCallback((pair: [CardId, CardId]) => {
    const next: ScheduleState = {
      featured: pair,
      nextRotationAt: Date.now() + ROTATION_MS, // resume auto-rotation 24h from now
      isManual: true,
    };
    setSchedule(next);
    setShowPicker(false);
  }, []);

  const handleResumeAuto = useCallback(() => {
    if (!schedule) return;
    const next: ScheduleState = {
      ...schedule,
      isManual: false,
      nextRotationAt: Date.now() + ROTATION_MS,
    };
    setSchedule(next);
  }, [schedule]);

  if (!schedule) return null; // SSR safety — renders nothing until hydrated

  const featuredCards = schedule.featured
    .map((id) => HERO_CARDS.find((c) => c.id === id))
    .filter(Boolean) as typeof HERO_CARDS;

  return (
    <>
      <section className="w-full py-10 px-4 md:px-8 lg:px-12">
        {/* ── Section header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 max-w-5xl mx-auto">
          <div>
            <p
              className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-1.5 flex items-center gap-2"
            >
              Featured Today
              <span className="block w-8 h-px bg-white/20" />
            </p>
            <h2
              className="text-white font-heading font-black leading-none tracking-[-0.02em]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              Explore Categories
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {schedule && (
              <Countdown
                nextRotationAt={schedule.nextRotationAt}
                isManual={schedule.isManual}
              />
            )}

            {schedule.isManual && (
              <motion.button
                onClick={handleResumeAuto}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
              >
                Resume Auto
              </motion.button>
            )}

            <motion.button
              onClick={() => setShowPicker(true)}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white text-xs font-semibold tracking-wide transition-colors"
              aria-label="Manually choose featured categories"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1 6.5H12M6.5 1V12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Choose Manually
            </motion.button>
          </div>
        </div>

        {/* ── Featured card pair ───────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={schedule.featured.join("-")}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {featuredCards.map((card, i) => (
              <HeroCard key={card.id} {...card} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Manual picker modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showPicker && schedule && (
          <ManualPicker
            current={schedule.featured}
            onConfirm={handleManualConfirm}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FeaturedCategories;