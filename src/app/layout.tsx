import type { Metadata } from "next";
import { Geom, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/shared/header/Header";
import { OverlayProvider } from "@/components/providers/OverlayProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geom = Geom({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Hermes",
    default: "Hermes — Shop Everything",
  },
  description: "Hermes is your one-stop e-commerce destination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geom.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <OverlayProvider>
          <Header />
          <TooltipProvider>{children}</TooltipProvider>
        </OverlayProvider>
      </body>
    </html>
  );
}
