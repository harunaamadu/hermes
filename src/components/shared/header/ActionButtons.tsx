"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceType } from "@/hooks/use-device";
import { useBadgeCounts } from "@/hooks/use-badge-counts";
import { useSearchPanel } from "@/context/search-context";
import { ACTIONBUTTONS } from "@/lib/constants";
import NavBadge from "./NavBadge";
import { cn } from "@/lib/utils";

const ActionButtons = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  const pathname = usePathname();
  const badgeCounts = useBadgeCounts();
  const { isOpen: searchOpen, toggle: toggleSearch } = useSearchPanel();

  const isMobileDevice = isMobile ?? deviceType === "mobile";

  // On mobile, hide buttons explicitly marked mobile:false
  const buttons = isMobileDevice
    ? ACTIONBUTTONS.filter((b) => b.mobile === false)
    : ACTIONBUTTONS.slice(0,4);

  return (
    <nav className="flex items-center gap-6" aria-label="Header actions">
      {buttons.map((b) => {
        const Icon = b.icon;

        const isSearchButton = b.actionId === "search";
        const isActive = isSearchButton
          ? searchOpen
          : b.href
          ? pathname === b.href
          : false;

        const badgeCount =
          b.badge?.storeKey && b.badge.storeKey in badgeCounts
            ? badgeCounts[b.badge.storeKey as keyof typeof badgeCounts]
            : 0;

        const ariaLabel = badgeCount > 0 ? `${b.label} (${badgeCount})` : b.label;

        const content = (
          <>
            <span className="relative flex items-center justify-center">
              <Icon className="size-5" />
              {b.badge && (
                <NavBadge variant={b.badge.variant} count={badgeCount} />
              )}
            </span>
            <span className="text-[10px]">{b.label}</span>
          </>
        );

        const sharedClass = cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive && "text-foreground"
        );

        if (isSearchButton) {
          return (
            <Button
              key={b.id}
              variant="ghost"
              size="icon-lg"
              aria-label={searchOpen ? "Close search" : ariaLabel}
              aria-expanded={searchOpen}
              aria-controls="search-panel"
              className={sharedClass}
              onClick={toggleSearch}
            >
              {content}
            </Button>
          );
        }

        if (b.href) {
          return (
            <Button
              key={b.id}
              variant="ghost"
              size="icon-lg"
              aria-label={ariaLabel}
              aria-current={isActive ? "page" : undefined}
              asChild
            >
              <Link href={b.href} className={sharedClass}>
                {content}
              </Link>
            </Button>
          );
        }

        return (
          <Button
            key={b.id}
            variant="ghost"
            size="icon-lg"
            aria-label={ariaLabel}
            className={sharedClass}
          >
            {content}
          </Button>
        );
      })}
    </nav>
  );
};

export default ActionButtons;