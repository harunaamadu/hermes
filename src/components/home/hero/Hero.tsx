"use client";

import React, { useRef } from "react";
import { useHeaderHeight } from "@/hooks/use-header-height";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceType } from "@/hooks/use-device";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroCarousel from "./HeroCarousel";
import HeroFeatured from "./HeroFeatured";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  const headerHeight = useHeaderHeight();

  useGSAP(() => {
    gsap.timeline({ repeat: -1 }).fromTo(
      "#pulse",
      { scale: 1, opacity: 1 },
      {
        scale: 3,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      },
    );
  });

  // isMobile is undefined until the hook resolves on the client.
  // Fall back to deviceType (also client-side) in the meantime.
  const isMobileDevice = isMobile ?? deviceType === "mobile";

  // On desktop: fill exactly the viewport below the header.
  // On mobile: let content flow naturally (no fixed height).
  const sectionStyle: React.CSSProperties =
    !isMobileDevice && headerHeight
      ? { height: `calc(100dvh - ${headerHeight}px)` }
      : {};

  return (
    <section
      className={cn(
        "w-full",
        // Mobile gets a natural min-height so the hero is never invisible
        isMobileDevice && "min-h-[60dvh]",
      )}
      style={sectionStyle}
    >
      <div className="grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_480px] gap-6 w-full max-w-360 h-full mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Carousel */}
        <HeroCarousel />

        {/* Featured side cards */}
        <HeroFeatured />
      </div>
    </section>
  );
};

export default Hero;