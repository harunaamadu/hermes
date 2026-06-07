// src/app/(shop)/dashboard/bag/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartTab } from "@/components/cart/CartTab";
import { WishlistTab } from "@/components/cart/WishlistTab";
import {
  DUMMY_CART_ITEMS,
  DUMMY_HISTORY,
  DUMMY_WISHLIST_ITEMS,
} from "@/lib/cart-data";
import {
  ShoppingCart,
  HistoryIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import HistoryTab from "@/components/cart/HistoryTab";

type Tab = "cart" | "wishlist" | "history";

const TABS: {
  id: Tab;
  label: string;
  icon: typeof ShoppingCart;
  count: number;
}[] = [
  {
    id: "cart",
    label: "Cart",
    icon: ShoppingCartIcon,
    count: DUMMY_CART_ITEMS.length,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: HeartIcon,
    count: DUMMY_WISHLIST_ITEMS.length,
  },
  {
    id: "history",
    label: "History",
    icon: HistoryIcon,
    count: DUMMY_HISTORY.length,
  },
];

export default function BagPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial tab from ?tab= param; fall back to "cart"
  const initialTab = (searchParams.get("tab") as Tab) ?? "cart";
  const [tab, setTab] = useState<Tab>(
    TABS.some((t) => t.id === initialTab) ? initialTab : "cart",
  );

  // Sync URL whenever tab changes — shallow replace, no scroll
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "cart") {
      params.delete("tab"); // cart is default, keep URL clean
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(`/cart${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderTab = () => {
    switch (tab) {
      case "cart":
        return <CartTab initialItems={DUMMY_CART_ITEMS} />;

      case "wishlist":
        return <WishlistTab initialItems={DUMMY_WISHLIST_ITEMS} />;

      case "history":
        return <HistoryTab history={DUMMY_HISTORY} />;

      default:
        return null;
    }
  };

  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        {/* ── Page header ───────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-1 border-b border-border pb-6">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Your
          </p>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            {tab === "cart" ? "Shopping Cart" : "Wishlist"}
          </h1>
        </div>

        {/* ── Tab bar ────────────────────────────────────────────────── */}
        <div className="mb-8 flex gap-0 border-b border-border">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-5 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-widest transition-colors -mb-px",
                tab === id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={13} />
              {label}
              {/* Count chip */}
              <span
                className={cn(
                  "flex items-center justify-center min-w-4.5 px-1 py-px text-[9px] font-bold tabular-nums",
                  tab === id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Animated tab content ────────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
