"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X, Star, TrendingUp } from "lucide-react";
import {
  DUMMY_SEARCH_ITEMS,
} from "@/lib/search-data";
import { useSearchPanel } from "@/context/search-context";
import { useHeaderHeight } from "@/hooks/use-header-height";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Product, SEARCH_CATEGORIES } from "@/types/product";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const TRENDING = DUMMY_SEARCH_ITEMS
  .filter((product) => product.isTrending)
  .sort(
    (a, b) =>
      (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
      (a.createdAt ? new Date(a.createdAt).getTime() : 0)
  )
  .map((product) => product.name)
  .slice(0, 10);

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent font-semibold text-foreground">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const TagChip = ({ tag }: { tag: Product["tag"] }) => {
  if (!tag || Array.isArray(tag)) return null;
  const map: Record<string, string> = {
    New: "bg-foreground text-background",
    Sale: "bg-destructive text-destructive-foreground",
    Hot: "bg-amber-500 text-white",
  };
  return (
    <span
      className={cn(
        "px-1.5 py-px text-[9px] font-bold uppercase tracking-widest",
        map[tag],
      )}
    >
      {tag}
    </span>
  );
};

export const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5">
    <Star className="size-3 fill-amber-400 stroke-amber-400" />
    <span className="text-[10px] text-muted-foreground">{rating}</span>
  </span>
);

const ResultCard = ({
  item,
  query,
  index,
}: {
  item: Product;
  query: string;
  index: number;
}) => (
  <article
    className="group flex cursor-pointer items-center gap-4 border-b border-border/50 px-2 py-3 transition-colors hover:bg-muted/30"
    style={{ animationDelay: `${index * 30}ms` }}
  >
    <div
      className="size-14 shrink-0 border border-border/40"
      style={{ backgroundColor: item.image }}
      aria-hidden="true"
    />
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {highlight(item.brand, query)}
        </span>
        <TagChip tag={item.tag} />
      </div>
      <p className="truncate text-sm font-medium leading-snug text-foreground">
        {highlight(item.name, query)}
      </p>
      <div className="mt-0.5 flex items-center gap-3">
        <Stars rating={item.review.rating} />
        <span className="text-[10px] text-muted-foreground">
          ({item.review.count})
        </span>
        <span className="text-[10px] capitalize text-muted-foreground">
          {item.category}
        </span>
      </div>
    </div>
    <div className="flex shrink-0 flex-col items-end">
      <span className="text-sm font-semibold text-foreground">
        ${item.price}
      </span>
      {item.originalPrice && (
        <span className="text-[11px] text-muted-foreground line-through">
          ${item.originalPrice}
        </span>
      )}
    </div>
  </article>
);

const EmptyState = ({ query }: { query: string }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center select-none">
    <SearchIcon className="size-8 text-muted-foreground/30" strokeWidth={1} />
    <p className="text-sm text-muted-foreground">
      No results for{" "}
      <span className="font-semibold text-foreground">"{query}"</span>
    </p>
    <p className="text-xs text-muted-foreground/60">
      Try a different keyword or browse categories
    </p>
  </div>
);

const IdleState = ({ onTrending }: { onTrending: (t: string) => void }) => (
  <div className="flex flex-1 flex-col gap-6 px-2 py-6">
    <div>
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        <TrendingUp className="size-3" /> Trending
      </p>
      <ul className="flex flex-col">
        {TRENDING.map((t) => (
          <li key={t}>
            <button
              type="button"
              onClick={() => onTrending(t)}
              className="group flex w-full items-center justify-between border-b border-border/40 px-2 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted/30"
            >
              <span>{t}</span>
              <SearchIcon className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const SearchPanel = () => {
  const { isOpen, close } = useSearchPanel();
  const headerHeight = useHeaderHeight();

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const handleClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const handleTrending = useCallback((term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  const results = query.trim()
    ? DUMMY_SEARCH_ITEMS.filter((item) => {
        const q = query.toLowerCase();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;
        return matchesQuery && matchesCategory;
      })
    : [];

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          id="search-panel"
          key="search-panel"
          role="search"
          aria-label="Site search"
          // fixed: overlays the page below the header, not part of document flow
          className="fixed left-0 right-0 z-50 bg-background overflow-hidden"
          style={{
            top: headerHeight ? `${headerHeight}px` : "0px",
            bottom: 0,
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div
            className="grid h-full w-full max-w-360 mx-auto px-4 py-4 md:px-6 lg:px-8"
            style={{ gridTemplateRows: "auto auto 1fr auto" }}
          >
            {/* Search bar */}
            <div className="flex items-center gap-0 border-b border-border pb-4">
              <Label
                htmlFor={inputId}
                className="flex size-9 shrink-0 items-center justify-center text-muted-foreground"
                aria-label="Search"
              >
                <SearchIcon size={15} />
              </Label>

              <Input
                ref={inputRef}
                id={inputId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands…"
                className="h-9 flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 dark:placeholder:text-neutral-700"
                autoComplete="off"
                spellCheck={false}
              />

              {hasQuery && (
                <span className="mr-3 shrink-0 bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
              )}

              {hasQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                aria-label="Close search panel"
                className="ml-2 hidden shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground md:flex"
              >
                Close
              </Button>
            </div>

            {/* Category filter */}
            {hasQuery && (
              <div className="flex items-center gap-0 overflow-x-auto py-3 scrollbar-none">
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "shrink-0 border-b-2 px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-widest transition-colors",
                      activeCategory === cat
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable results */}
            <div className="overflow-y-auto">
              {!hasQuery && <IdleState onTrending={handleTrending} />}

              {hasQuery && hasResults && (
                <>
                  <p className="mb-1 px-2 pt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                    Search results
                  </p>
                  <ul>
                    {results.map((item, i) => (
                      <li key={item.id}>
                        <ResultCard item={item} query={query} index={i} />
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {hasQuery && !hasResults && <EmptyState query={query} />}
            </div>

            {/* Close button — bottom, mobile-first */}
            <div className="border-t border-border pt-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-[11px] uppercase tracking-widest"
                onClick={close}
              >
                Close Search
              </Button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default SearchPanel;