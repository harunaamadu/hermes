"use client";

import { OrderStatus, PurchaseHistory } from "@/lib/cart-data";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface HistoryTabProps {
  history: PurchaseHistory[];
}

const HistoryTab = ({ history }: HistoryTabProps) => {
  const statusColorCode: Record<OrderStatus, string> = {
    pending: "border-blue-600 bg-blue-600/10 text-blue-600",
    processing: "border-yellow-600 bg-yellow-600/10 text-yellow-600",
    shipped: "border-purple-600 bg-purple-600/10 text-purple-600",
    delivered: "border-green-600 bg-green-600/10 text-green-600",
    cancelled: "border-destructive bg-destructive/10 text-destructive",
  };

  return (
    <div className="grid gap-3">
      {history.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "p-4 border-[0.01mm]!",
            statusColorCode[item.status]
          )}
        >
          <div className="flex items-start justify-between">
            <h4 className="text-base font-semibold">
              {item.orderNumber}
            </h4>

            <span
              className={cn(
                "rounded-full border px-2 py-1 text-xs font-medium capitalize",
                statusColorCode[item.status]
              )}
            >
              {item.status}
            </span>
          </div>

          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p>Total Items: {item.totalItems}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Total Amount: ${item.totalAmount}</p>
            <p>Payment: {item.paymentMethod}</p>
            <p>
              Ordered:
              {" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HistoryTab;