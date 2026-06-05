"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cat, LayoutGrid, X, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import Categories from "./Categories";
import { useOverlay } from "@/components/providers/OverlayProvider";
import { useClickOutside } from "@/hooks/use-click-outside";

const Header = () => {
  const [isCategoriesOpen, setOpen] = useState(false);
  const { showOverlay, hideOverlay } = useOverlay();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openMenu = () => { setOpen(true);  showOverlay(); };
  const closeMenu = () => { setOpen(false); hideOverlay(); };

  useClickOutside(wrapperRef as React.RefObject<HTMLElement>, closeMenu, isCategoriesOpen);

  const isMobileDevice = useIsMobile() ?? false;

  const navSkeletonWidths = ["w-16", "w-20", "w-24", "w-28", "w-32"];

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-muted text-muted-foreground">
        <div className="flex items-center justify-between w-full max-w-360 mx-auto py-2 px-4 md:px-6 lg:px-8 text-xs">
          <p>Announcement: Free shipping on orders over $50!</p>

          <Button
            variant="destructive"
            size="icon-sm"
            aria-label="Close announcement"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between w-full max-w-360 mx-auto px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="font-heading text-2xl md:text-3xl font-bold select-none group"
            >
              Her
              <span className="text-inherit group-hover:text-primary transition-colors ease-out">
                mes
              </span>
            </Link>

            <div className="relative" ref={wrapperRef}>
              <Button
                variant="outline"
                size="lg"
                className=""
                onClick={() => {
                  setOpen((prev) => !prev);
                }}
                aria-label="Toggle mega navigation"
              >
                {React.createElement(isCategoriesOpen ? XIcon : LayoutGrid, {
                  className: "size-4",
                })}{" "}
                All
              </Button>

              <Categories open={isCategoriesOpen} onClose={closeMenu} />
            </div>
          </div>

          {/* Desktop Navigation Skeleton */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="desktop navigation"
          >
            {Array.from({
              length: isMobileDevice ? 3 : 5,
            }).map((_, index) => (
              <Skeleton
                key={index}
                className={`h-6 ${navSkeletonWidths[index % navSkeletonWidths.length]}`}
              />
            ))}
          </nav>

          {/* Action Buttons Skeleton */}
          <nav className="flex items-center gap-3" aria-label="header actions">
            {Array.from({ length: isMobileDevice ? 2 : 4 }).map((_, index) => (
              <Skeleton key={index} className="size-10 cursor-pointer" />
            ))}
          </nav>
        </div>
      </header>

      {/* Bottom Navigation Skeleton (Mobile Only) */}
      {isMobileDevice && (
        <nav
          className="flex items-center justify-evenly gap-4 fixed bottom-0 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md border-t p-3 border-muted max-w-full w-80"
          aria-label="mobile navigation"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="size-10 cursor-pointer" />
          ))}
        </nav>
      )}
    </>
  );
};

export default Header;
