"use client";

import React, { forwardRef } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XIcon } from "lucide-react";
import { CATEGORIES, NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "./Logo";

type MobileMenuProps = {
  className?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ className }, ref) => {
    const { activePanel, closeAll } = useUIStore();

    const open = activePanel === "menu";

    const mainLinkClass = cn(
      "inline-flex justify-between w-full px-2 py-1.5 mb-1 text-sm font-semibold select-none",
      "hover:text-primary transition-colors duration-150 ease-in-out",
    );

    const subLinkClass = cn(
      "block px-2 py-1.5 text-sm font-light text-muted-foreground",
      "hover:text-foreground hover:bg-muted",
      "transition-colors duration-150 ease-in-out",
    );

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.aside
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              ref={ref}
              variants={containerVariants}
              className={cn(
                "fixed top-0 left-0 h-full w-sm max-w-full bg-background text-foreground border-r shadow-xl p-6 z-50",
                className,
              )}
            >
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-b-border">
                  {/* LOGO */}
                  <Logo className="text-xl md:text-2xl" />

                  <Button
                    variant="outline"
                    size="icon-lg"
                    onClick={closeAll}
                    aria-label="Open menu"
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>

                <nav className="flex flex-col gap-3">
                  <Tabs defaultValue="menu">
                    <TabsList variant="line">
                      <TabsTrigger value="menu">Menu</TabsTrigger>
                      <TabsTrigger value="categories">Categories</TabsTrigger>
                      <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="menu"
                      className="flex flex-col gap-3 mt-3"
                    >
                      <motion.div variants={itemVariants}>
                        {NAV_ITEMS.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={mainLinkClass}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    </TabsContent>

                    <TabsContent
                      value="categories"
                      className="mt-3 flex w-full flex-col gap-3"
                    >
                      <ScrollArea className="flex-1 h-100 max-h-full w-full pr-3">
                        <Accordion type="single" collapsible className="w-full">
                          {CATEGORIES.map((c) => (
                            <motion.div key={c.href} variants={itemVariants}>
                              <AccordionItem value={c.name}>
                                <div className="flex items-center justify-between">
                                  <Link
                                    href={c.href}
                                    className={mainLinkClass}
                                    onClick={closeAll}
                                  >
                                    {c.name}
                                  </Link>

                                  {c.items.length > 0 && <AccordionTrigger />}
                                </div>

                                {c.items.length > 0 && (
                                  <AccordionContent className="[&_a]:no-underline pl-2">
                                    {c.items.map((subc) => (
                                      <Link
                                        key={subc.href}
                                        href={subc.href}
                                        className={subLinkClass}
                                        onClick={closeAll}
                                      >
                                        {subc.name}
                                      </Link>
                                    ))}
                                  </AccordionContent>
                                )}
                              </AccordionItem>
                            </motion.div>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="account"
                      className="flex flex-col gap-3 mt-3"
                    >
                      <motion.div variants={itemVariants}>
                        <p className="text-center [&_a]:underline">
                          No signed in{" "}
                          <Link
                            href={`/sign-in`}
                            className="hover:text-primary transition-colors duration-300"
                          >
                            Sign in
                          </Link>
                        </p>
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </nav>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  },
);

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
