"use client";

import React, { useRef, useId } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Built-in animation variants.
 *
 * fade        – opacity 0 → 1
 * up          – fade + translateY(+offset) → 0
 * down        – fade + translateY(-offset) → 0
 * left        – fade + translateX(+offset) → 0  (slides in from the right)
 * right       – fade + translateX(-offset) → 0  (slides in from the left)
 * scale       – fade + scale(scaleFrom) → 1
 * clip-up     – clip-path wipe from bottom edge upward (text/block reveal)
 * clip-left   – clip-path wipe from right edge leftward
 * rotate      – fade + rotateX tilt dropping into place
 * blur        – fade + blur(blurAmount) → blur(0)
 * split-words – splits children text into words, staggers each word upward
 * split-chars – splits children text into chars, staggers each char upward
 */
export type RevealVariant =
  | "fade"
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "clip-up"
  | "clip-left"
  | "rotate"
  | "blur"
  | "split-words"
  | "split-chars";

export interface RevealProps {
  /** Content to reveal */
  children: React.ReactNode;
  /** Animation style — default "up" */
  variant?: RevealVariant;
  /** Seconds before animation starts after trigger — default 0 */
  delay?: number;
  /** Animation duration in seconds — default 0.8 */
  duration?: number;
  /** Distance in px used by directional variants — default 40 */
  offset?: number;
  /** Scale start value used by "scale" variant — default 0.85 */
  scaleFrom?: number;
  /** Blur start value in px used by "blur" variant — default 12 */
  blurAmount?: number;
  /** GSAP ease string — default "power3.out" */
  ease?: string;
  /** ScrollTrigger start position — default "top 88%" */
  triggerStart?: string;
  /** When true the animation fires once and does not reverse — default true */
  once?: boolean;
  /** Extra class names on the wrapper element */
  className?: string;
  /** HTML tag for the wrapper — default "div" */
  as?: keyof React.JSX.IntrinsicElements;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wrap every word in a <span> and return the fragment + array of span els */
function wrapWords(el: HTMLElement): HTMLElement[] {
  const text = el.innerText;
  el.innerHTML = text
    .split(" ")
    .map((w) => `<span class="gsap-word" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="gsap-word-inner" style="display:inline-block">${w}</span></span>`)
    .join(" ");
  return Array.from(el.querySelectorAll<HTMLElement>(".gsap-word-inner"));
}

/** Wrap every character in a <span> and return the array of inner span els */
function wrapChars(el: HTMLElement): HTMLElement[] {
  const text = el.innerText;
  el.innerHTML = text
    .split("")
    .map((ch) =>
      ch === " "
        ? " "
        : `<span class="gsap-char" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="gsap-char-inner" style="display:inline-block">${ch}</span></span>`,
    )
    .join("");
  return Array.from(el.querySelectorAll<HTMLElement>(".gsap-char-inner"));
}

// ─── Component ────────────────────────────────────────────────────────────────

const Reveal = React.forwardRef<HTMLElement, RevealProps>(
  (
    {
      children,
      variant = "up",
      delay = 0,
      duration = 0.8,
      offset = 40,
      scaleFrom = 0.85,
      blurAmount = 12,
      ease = "power3.out",
      triggerStart = "top 88%",
      once = true,
      className,
      as: Tag = "div",
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) ?? localRef;
    const uid = useId();

    useGSAP(
      () => {
        const el = ref.current;
        if (!el) return;

        const scrollTrigger: ScrollTrigger.Vars = {
          trigger: el,
          start: triggerStart,
          toggleActions: once ? "play none none none" : "play none none reverse",
        };

        // ── Split variants ────────────────────────────────────
        if (variant === "split-words" || variant === "split-chars") {
          const targets =
            variant === "split-words" ? wrapWords(el) : wrapChars(el);

          gsap.fromTo(
            targets,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration,
              ease,
              stagger: variant === "split-words" ? 0.07 : 0.03,
              delay,
              scrollTrigger,
            },
          );
          return;
        }

        // ── Clip variants ─────────────────────────────────────
        if (variant === "clip-up") {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration,
              ease,
              delay,
              scrollTrigger,
            },
          );
          return;
        }

        if (variant === "clip-left") {
          gsap.fromTo(
            el,
            { clipPath: "inset(0% 0% 0% 100%)", opacity: 1 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration,
              ease,
              delay,
              scrollTrigger,
            },
          );
          return;
        }

        // ── Standard fromTo variants ──────────────────────────
        const fromVars: gsap.TweenVars = { opacity: 0 };
        const toVars: gsap.TweenVars = {
          opacity: 1,
          duration,
          ease,
          delay,
          scrollTrigger,
        };

        switch (variant) {
          case "up":
            fromVars.y = offset;
            toVars.y = 0;
            break;
          case "down":
            fromVars.y = -offset;
            toVars.y = 0;
            break;
          case "left":
            fromVars.x = offset;
            toVars.x = 0;
            break;
          case "right":
            fromVars.x = -offset;
            toVars.x = 0;
            break;
          case "scale":
            fromVars.scale = scaleFrom;
            toVars.scale = 1;
            break;
          case "rotate":
            fromVars.rotationX = 30;
            fromVars.transformOrigin = "top center";
            fromVars.y = offset * 0.5;
            toVars.rotationX = 0;
            toVars.y = 0;
            break;
          case "blur":
            fromVars.filter = `blur(${blurAmount}px)`;
            fromVars.y = offset * 0.5;
            toVars.filter = "blur(0px)";
            toVars.y = 0;
            break;
          case "fade":
          default:
            break;
        }

        gsap.fromTo(el, fromVars, toVars);
      },
      { scope: ref, dependencies: [variant, delay, duration, offset, ease, triggerStart, once] },
    );

    return (
      // @ts-expect-error – dynamic tag with forwarded ref
      <Tag ref={ref} className={cn(className)} data-reveal={uid}>
        {children}
      </Tag>
    );
  },
);

Reveal.displayName = "Reveal";

export default Reveal;


// ─── Usage examples ───────────────────────────────────────────────────────────
//
// Basic fade-up (default):
//   <Reveal><p>Hello</p></Reveal>
//
// Directional slides:
//   <Reveal variant="left">...</Reveal>
//   <Reveal variant="right" offset={60}>...</Reveal>
//   <Reveal variant="down" delay={0.2}>...</Reveal>
//
// Clip wipes (great for images & blocks):
//   <Reveal variant="clip-up"><Image ... /></Reveal>
//   <Reveal variant="clip-left"><div className="bg-primary" /></Reveal>
//
// Scale pop:
//   <Reveal variant="scale" scaleFrom={0.7} duration={1}>...</Reveal>
//
// 3-D rotate drop:
//   <Reveal variant="rotate" ease="back.out(1.4)">...</Reveal>
//
// Motion blur:
//   <Reveal variant="blur" blurAmount={20}>...</Reveal>
//
// Word-by-word text reveal:
//   <Reveal variant="split-words" as="h1">Sharp Edges</Reveal>
//
// Character-by-character text reveal:
//   <Reveal variant="split-chars" as="span" duration={0.5}>Hello</Reveal>
//
// Custom trigger & repeat:
//   <Reveal variant="up" triggerStart="top 70%" once={false} delay={0.4}>
//     <Card />
//   </Reveal>
//
// Staggered siblings — wrap each in its own Reveal with increasing delay:
//   {items.map((item, i) => (
//     <Reveal key={item.id} variant="up" delay={i * 0.1}>
//       <Card {...item} />
//     </Reveal>
//   ))}