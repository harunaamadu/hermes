"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCard, { HERO_CARDS } from "./HeroCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardId = string;

interface ScheduleState {
  featured: [CardId, CardId];
  nextRotationAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "hero_featured_schedule";
const ROTATION_MS = 24 * 60 * 60 * 1000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom(exclude: [CardId, CardId]): [CardId, CardId] {
  const pool = HERO_CARDS.map((c) => c.id as CardId);
  const source = pool.filter((id) => !exclude.includes(id));
  const shuffled = (source.length >= 2 ? source : pool).sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function getSchedule(): ScheduleState {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ScheduleState;
    } catch { /* fall through */ }
  }
  const featured = pickRandom(["", ""] as [CardId, CardId]);
  return { featured, nextRotationAt: Date.now() + ROTATION_MS };
}

function saveSchedule(state: ScheduleState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const HeroFeatured: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleState | null>(null);

  // Hydrate on mount
  useEffect(() => {
    const s = getSchedule();
    saveSchedule(s);
    setSchedule(s);
  }, []);

  // Auto-rotate: check every minute
  useEffect(() => {
    if (!schedule) return;
    const tick = () => {
      if (Date.now() >= schedule.nextRotationAt) {
        const next: ScheduleState = {
          featured: pickRandom(schedule.featured),
          nextRotationAt: Date.now() + ROTATION_MS,
        };
        saveSchedule(next);
        setSchedule(next);
      }
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [schedule]);

  if (!schedule) return null;

  const cards = schedule.featured
    .map((id) => HERO_CARDS.find((c) => c.id === id))
    .filter(Boolean) as typeof HERO_CARDS;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={schedule.featured.join("-")}
        className="grid grid-rows-2 gap-6 h-full min-h-[50dvh] max-w-full md:min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {cards.map((card, i) => (
          <HeroCard key={card.id} {...card} index={i} className="h-full" />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default HeroFeatured;