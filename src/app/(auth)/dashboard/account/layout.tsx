// src/app/(auth)/dashboard/account/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Hermes",
  description: "Sign in or create an account to continue.",
};

/**
 * Auth layout — intentionally bare.
 * No site header, no footer, no nav chrome.
 * The page itself handles all visual composition.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full w-full bg-background">
      {children}
    </main>
  );
}