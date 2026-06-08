"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  LucideIcon,
  ClockIcon,
  ShoppingBagIcon,
  SparkleIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react";
import TitleBar from "./TitleBar";
import Reveal from "@/components/animation/Reveal";
import { EMPTY_STATE_ICONS, EmptyStatePreset, Product, ProductLayoutProps, ProductsEmptyProps, ProductsSkeletonProps } from "@/types/product";

// ─── SkeletonCard ──────────────────────────────────────────────────────────

export const SkeletonCard = () => (
  <div className="flex flex-col border border-border bg-background">
    <div className="aspect-square w-full animate-pulse bg-muted" />
    <div className="flex flex-col gap-2 p-4">
      <div className="h-2.5 w-1/3 animate-pulse rounded-none bg-muted" />
      <div className="h-3 w-full animate-pulse rounded-none bg-muted" />
      <div className="h-3 w-4/5 animate-pulse rounded-none bg-muted" />
      <div className="mt-1 h-2 w-1/2 animate-pulse rounded-none bg-muted" />
      <div className="mt-2 h-5 w-1/3 animate-pulse rounded-none bg-muted" />
    </div>
    <div className="border-t border-border p-3">
      <div className="h-8 w-full animate-pulse rounded-none bg-muted" />
    </div>
  </div>
);

export const ProductsSkeleton = ({
  count = 4,
  className = "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
}: ProductsSkeletonProps) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const ProductsEmpty = ({
  icon = "default",
  title = "No products found",
  description = "Try adjusting your filters or check back later.",
  action,
}: ProductsEmptyProps) => {
  const IconComponent =
    typeof icon === "string"
      ? EMPTY_STATE_ICONS[icon as EmptyStatePreset]
      : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-68 flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/20 px-6 text-center p-6"
    >
      <div className="flex size-12 items-center justify-center border border-border bg-background">
        <IconComponent size={22} className="text-muted-foreground" />
      </div>

      <div>
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};


// ─── Column class map ───────────────────────────────────────────────────────

export const colClass: Record<
  NonNullable<ProductLayoutProps["columns"]>,
  string
> = {
  2: "md:grid-cols-2",
  4: "md:grid-cols-2 lg:grid-cols-4",
  5: "md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
};

// ─── ProductLayout ──────────────────────────────────────────────────────────

const ProductLayout = ({
  eyebrow,
  title,
  products,
  loading = false,
  skeletonCount = 5,
  link,
  breakpoint = "sm",
  mobileCardBasis = "basis-[72vw]",
  emptyIcon = "default",
  emptyTitle = "No products found",
  emptyDescription = "Check back soon.",
  columns = 5,
  stagger = 0.08,
}: ProductLayoutProps) => {
  const isEmpty = !loading; // <=  && products.length === 0

  // Tailwind needs full strings — derive show/hide classes from breakpoint
  // so the purge scanner sees them as complete class names.
  const hideOnMobile = breakpoint === "md" ? "md:hidden" : "sm:hidden";
  const showOnDesktop =
    breakpoint === "md" ? "hidden md:block" : "hidden sm:block";

  return (
    <div className="mx-auto w-full max-w-360 px-4 py-8 md:px-8">
      {/* Title — always outside StaggerReveal */}
      <TitleBar
        title={`${title}`} // <=  ${!loading && products.length > 0 ? ` (${products.length})` : ""}
      />

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <ProductsSkeleton
          count={skeletonCount}
          className={`grid gap-4 ${colClass[columns]}`}
        />
      )}

      {/* ── Empty ────────────────────────────────────────────────────────── */}
      {isEmpty && (
        <ProductsEmpty
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      )}

      {/* ── Products ─────────────────────────────────────────────────────── */}
      {!loading && ( // <=  products.length > 0 &&
        <>
          {/* Mobile — horizontal drag carousel */}
          <div className={hideOnMobile}>
            <Carousel opts={{ align: "start", dragFree: true }}>
              <CarouselContent className="-ml-3">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className={`pl-3 ${mobileCardBasis}`}
                  >
                    {/* <ProductCard product={product} variant="default" /> */}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Desktop — staggered grid */}
          <div className={showOnDesktop}>
            <Reveal
              variant="blur"
              as="div"
              className={`grid gap-4 ${colClass[columns]}`}
            >
              {products.map((product) => (
                // <ProductCard
                //   key={product.id}
                //   product={product}
                //   variant="default"
                // />
                <span className="">No product yet</span>
              ))}
            </Reveal>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductLayout;
