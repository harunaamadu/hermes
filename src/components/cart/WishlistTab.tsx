"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WishlistItem } from "@/lib/cart-data";

interface WishlistTabProps {
  initialItems: WishlistItem[];
}

const TagChip = ({ tag }: { tag?: WishlistItem["tag"] }) => {
  if (!tag) return null;
  const map = {
    New: "bg-[#EFEFEF] text-[#1E1E1E]",
    Sale: "bg-destructive text-white",
    "Low Stock": "bg-amber-500 text-white",
  };
  return (
    <span className={cn("px-1.5 py-px text-[9px] font-bold uppercase tracking-widest", map[tag])}>
      {tag}
    </span>
  );
};

export function WishlistTab({ initialItems }: WishlistTabProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>(
    () =>
      Object.fromEntries(
        initialItems.map((i) => [i.id, i.sizes[0] ?? ""])
      )
  );

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const moveToCart = (id: number) => {
    // TODO: push to cart store
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, inCart: true } : i))
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-28 text-center">
        <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
        <Button variant="outline" size="sm" className="text-[11px] uppercase tracking-widest" asChild>
          <a href="/">Discover Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.id} className="group flex flex-col border border-border">
          {/* Image / swatch */}
          <div
            className="relative aspect-3/4 w-full"
            style={{ backgroundColor: item.swatch }}
          >
            <div className="absolute left-2 top-2 flex gap-1">
              <TagChip tag={item.tag} />
            </div>
            {item.inCart && (
              <div className="absolute right-2 top-2 bg-foreground px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-background">
                In Cart
              </div>
            )}
            {/* Remove */}
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove ${item.name} from wishlist`}
              className="absolute bottom-2 right-2 flex size-7 items-center justify-center bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:text-destructive"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {item.brand}
              </p>
              <p className="text-sm font-medium leading-snug text-foreground">
                {item.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-[12px] text-muted-foreground line-through">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Size selector */}
            {item.sizes.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {item.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setSelectedSizes((prev) => ({ ...prev, [item.id]: s }))
                    }
                    className={cn(
                      "px-2 py-1 text-[10px] uppercase tracking-wide transition-colors border",
                      selectedSizes[item.id] === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Add to cart */}
            <Button
              size="sm"
              variant={item.inCart ? "outline" : "default"}
              className="mt-auto w-full gap-2 text-[10px] uppercase tracking-widest"
              onClick={() => moveToCart(item.id)}
              disabled={item.inCart}
            >
              <ShoppingCart size={13} />
              {item.inCart ? "Already in Cart" : "Add to Cart"}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}