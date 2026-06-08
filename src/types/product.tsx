import { number } from "framer-motion";
import {
  LucideIcon,
  ClockIcon,
  ShoppingBagIcon,
  SparkleIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react";

export type ProductBadge =
  | "best-seller"
  | "new"
  | "sale"
  | "limited"
  | "prime"
  | "hot";

export const SEARCH_CATEGORIES = [
  "All",
  "fashion",
  "electronics",
  "home",
  "beauty",
  "sports",
  "toys",
  "books",
  "automotive",
] as const;

export type ProductCategory = (typeof SEARCH_CATEGORIES)[number];

export interface ProductReview {
  rating: number; // 1–5
  count: number;
}

export interface ProductVariant {
  label: string;
  value: string;
  inStock: boolean;
}

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category: ProductCategory;

  image: string;
  images?: string[];

  price: number;
  originalPrice?: number;
  discountPercent?: number;

  review: ProductReview;

  badge?: ProductBadge;
  description?: string;

  tag?: string | string[];

  variants?: ProductVariant[];

  inStock?: boolean;
  freeShipping?: boolean;
  deliveryDays?: number;

  sold?: number; // units sold — popularity indicator

  isWishlisted?: boolean;
  isTrending?: boolean;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export interface ProductGridFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  badge?: ProductBadge;
  freeShipping?: boolean;
  inStock?: boolean;
  sort?: SortOption;
}

export const EMPTY_STATE_ICONS = {
  history: ClockIcon,
  bestsellers: TrophyIcon,
  default: ShoppingBagIcon,
  SparklesIcon,
  recommendations: SparkleIcon,
} satisfies Record<string, LucideIcon>;

export type EmptyStatePreset = keyof typeof EMPTY_STATE_ICONS;

// ─── ProductsEmpty ─────────────────────────────────────────────────────────

export interface ProductsEmptyProps {
  /** Icon preset key or a custom icon component */
  icon?: EmptyStatePreset | LucideIcon;
  title?: string;
  description?: string;
  /** Optional CTA — e.g. "Browse all products" */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ProductLayoutProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  link?: { href: string; label: string };
  /**
   * Mobile breakpoint below which the carousel is used instead of the grid.
   * Defaults to "sm" (< 640 px).
   */
  breakpoint?: "sm" | "md";
  /**
   * Tailwind basis class controlling how wide each card is in the mobile carousel.
   * Defaults to "basis-[72vw]" — roughly 1.4 cards visible.
   */
  mobileCardBasis?: string;
  emptyIcon?: EmptyStatePreset;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 2 | 4 | 5;
  stagger?: number;
}

// ─── ProductsSkeleton ──────────────────────────────────────────────────────

export interface ProductsSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number;
  /** Tailwind grid class — defaults to a responsive 2→3→4 col grid */
  className?: string;
}
