import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your cart and saved items.",
};

export default function BagLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
