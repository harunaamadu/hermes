"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ACTIONBUTTONS } from "@/lib/constants";
import { useBadgeCounts } from "@/hooks/use-badge-counts";
import { useSearchPanel } from "@/context/search-context";
import NavBadge from "./NavBadge";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();
  const badgeCounts = useBadgeCounts();
  const { isOpen: searchOpen, toggle: toggleSearch } = useSearchPanel();

  const mobileButtons = ACTIONBUTTONS.filter((b) => b.mobile === true);

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-40 flex w-xs -translate-x-1/2 items-center justify-evenly border bg-background/90 p-3 backdrop-blur-md"
      aria-label="Mobile navigation"
    >
      {mobileButtons.map((b) => {
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
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              />
              {b.badge && (
                <NavBadge variant={b.badge.variant} count={badgeCount} />
              )}
            </span>
            <span
              className={cn(
                "text-[10px] transition-colors",
                isActive ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {b.label}
            </span>
          </>
        );

        const sharedClass = "flex flex-col items-center gap-1";

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
            onClick={undefined}
          >
            {content}
          </Button>
        );
      })}
    </nav>
  );
};

export default MobileNav;