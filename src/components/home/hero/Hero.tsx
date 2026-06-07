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

  // isMobile can be false (not mobile) or undefined (not yet resolved).
  // Only fall back to deviceType when isMobile is null/undefined.
  const isMobileDevice = isMobile == null ? deviceType === "mobile" : isMobile;

  // calc() can't go inside a Tailwind class — drive height via style instead.
  const sectionHeight: React.CSSProperties | undefined = isMobileDevice
    ? undefined // let mobile flow naturally; remove if you want a fixed height on mobile too
    : { height: headerHeight && `calc(100dvh - ${headerHeight}px)` };

  return (
    <section
      className={cn("w-full", isMobileDevice && "h-full bg-amber-50")}
      style={sectionHeight}
    >
      <div className="grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_480px] gap-6 w-full max-w-360 h-full mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Carousel with shadcn carousel */}
        <HeroCarousel />

        {/* Small cards (gadgets & fun / home decor) */}
        <HeroFeatured />
      </div>
    </section>
  );
};

export default Hero;
