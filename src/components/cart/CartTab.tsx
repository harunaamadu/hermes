"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartItem } from "@/lib/cart-data";

interface CartTabProps {
  initialItems: CartItem[];
}

const TagChip = ({ tag }: { tag?: CartItem["tag"] }) => {
  if (!tag) return null;
  const map = {
    New: "bg-foreground text-background",
    Sale: "bg-destructive text-destructive-foreground",
    "Low Stock": "bg-amber-500 text-white",
  };
  return (
    <span className={cn("px-1.5 py-px text-[9px] font-bold uppercase tracking-widest", map[tag])}>
      {tag}
    </span>
  );
};

export function CartTab({ initialItems }: CartTabProps) {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = items.reduce(
    (sum, i) => sum + ((i.originalPrice ?? i.price) - i.price) * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-28 text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <Button variant="outline" size="sm" className="text-[11px] uppercase tracking-widest" asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Item list */}
      <ul className="flex flex-col divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-6 first:pt-0">
            {/* Swatch */}
            <div
              className="size-24 shrink-0 border border-border/40 md:size-28"
              style={{ backgroundColor: item.swatch }}
              aria-hidden="true"
            />

            {/* Details */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {item.brand}
                  </p>
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {item.name}
                  </p>
                </div>
                <TagChip tag={item.tag} />
              </div>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-muted-foreground">
                  {item.colorLabel} · {item.size}
                </span>
              </div>

              {/* Price + controls */}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    aria-label="Decrease quantity"
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-[13px] tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    aria-label="Increase quantity"
                    className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.originalPrice && (
                      <p className="text-[11px] text-muted-foreground line-through">
                        ${(item.originalPrice * item.quantity).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Order summary */}
      <div className="flex flex-col gap-4 border border-border p-6 self-start lg:sticky lg:top-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
          Order Summary
        </p>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)
            </span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-destructive">
              <span>You save</span>
              <span>−${savings.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>

        <Button size="lg" className="w-full text-[11px] uppercase tracking-widest mt-1">
          Proceed to Checkout
        </Button>

        <button
          type="button"
          className="text-center text-[11px] text-muted-foreground underline-offset-2 hover:underline"
        >
          Enter promo code
        </button>
      </div>
    </div>
  );
}