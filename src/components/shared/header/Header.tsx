"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutGrid, MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceType } from "@/hooks/use-device";
import { useClickOutside } from "@/hooks/use-click-outside";

import { NAV_ITEMS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

import { useUIStore } from "@/store/ui-store";
import MobileMenu from "./MobileMenu";
import Categories from "./Categories";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import ActionButtons from "./ActionButtons";

const ITEM_WIDTH = 160;

const Header = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Both hooks always called unconditionally — no conditional hook calls.
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  // undefined = not yet resolved (SSR / first paint); fall back to deviceType.
  const isMobileDevice = isMobile ?? deviceType === "mobile";

  const [visibleItems, setVisibleItems] = useState(NAV_ITEMS);
  const [overflowItems, setOverflowItems] = useState<typeof NAV_ITEMS>([]);

  const activePanel = useUIStore((s) => s.activePanel);
  const openPanel = useUIStore((s) => s.openPanel);
  const closeAll = useUIStore((s) => s.closeAll);

  const isMenuOpen = activePanel === "menu";
  const isCategoriesOpen = activePanel === "categories";
  const isMoreOpen = activePanel === "more";

  useClickOutside(
    [navRef, menuRef, categoriesRef] as React.RefObject<HTMLElement>[],
    closeAll,
    isMenuOpen || isCategoriesOpen || isMoreOpen,
  );

  useEffect(() => {
    const calculateItems = () => {
      if (!navRef.current) return;
      const width = navRef.current.offsetWidth;
      const maxItems = Math.max(1, Math.floor((width - 120) / ITEM_WIDTH));
      setVisibleItems(NAV_ITEMS.slice(0, maxItems));
      setOverflowItems(NAV_ITEMS.slice(maxItems));
    };

    calculateItems();

    const observer = new ResizeObserver(calculateItems);
    if (navRef.current) observer.observe(navRef.current);
    window.addEventListener("resize", calculateItems);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateItems);
    };
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div id="announcement" className="w-full bg-muted text-muted-foreground">
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
      <header
        id="header"
        className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md"
      >
        <div className="flex items-center justify-between w-full max-w-360 mx-auto px-4 py-4 md:px-6 lg:px-8">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => openPanel("menu")}
              aria-label="Open menu"
              className="flex md:hidden"
            >
              <MenuIcon className="size-4" />
            </Button>

            <Logo />

            <div ref={categoriesRef} className="relative hidden md:block">
              <Button
                variant="outline"
                size="lg"
                onClick={() => openPanel("categories")}
                aria-label="Open categories"
              >
                <LayoutGrid className="size-4" />
                All
              </Button>
              <Categories />
            </div>
          </div>

          {/* Desktop nav */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center justify-center gap-6 flex-1"
            aria-label="desktop navigation"
          >
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:text-primary shrink-0"
              >
                {item.name}
              </Link>
            ))}

            <AnimatePresence mode="wait">
              {overflowItems.length > 0 && (
                <div className="relative shrink-0">
                  <button
                    onClick={() => openPanel(isMoreOpen ? null : "more")}
                    className="flex items-center gap-1 text-sm"
                  >
                    More
                    <ChevronDown className="size-4" />
                  </button>

                  {isMoreOpen && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full right-0 mt-2 min-w-56 rounded-lg border bg-background shadow-lg py-2 z-50"
                    >
                      {overflowItems.map((item) => (
                        <motion.a
                          key={item.href}
                          href={item.href}
                          variants={itemVariants}
                          className="block px-4 py-2 hover:bg-muted"
                        >
                          {item.name}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </nav>

          {/* Action buttons */}
          <ActionButtons />
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu ref={menuRef} />

      {/* Mobile Bottom Nav — only on mobile */}
      {isMobileDevice && <MobileNav />}
    </>
  );
};

export default Header;