"use client";

import { useState } from "react";
import { navigation } from "@/menu.config";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[60] w-10 h-10 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={cn(
              "block w-6 h-[1.5px] bg-foreground transition-all duration-300",
              isOpen && "rotate-45 translate-y-[4.5px]"
            )}
          />
          <span
            className={cn(
              "block w-6 h-[1.5px] bg-foreground transition-all duration-300",
              isOpen && "-rotate-45 -translate-y-[4.5px]"
            )}
          />
        </div>
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          {/* Header area */}
          <div className="flex justify-between items-center px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
              aria-label="Sustainability Lab Home"
            >
              <Image
                src="/logo-transparent.png"
                alt="The Sustainability Lab"
                width={160}
                height={70}
                className="h-9 w-auto object-contain dark:brightness-110"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="Close menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className="block w-6 h-[1.5px] bg-foreground rotate-45 translate-y-[4.5px]" />
                <span className="block w-6 h-[1.5px] bg-foreground -rotate-45 -translate-y-[4.5px]" />
              </div>
            </button>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="space-y-6">
              {navigation.map((section, idx) => (
                <MobileNavSection
                  key={section.number}
                  section={section}
                  index={idx}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 pt-8 border-t border-border/30">
              <Link
                href="/collaborate/contact"
                className="inline-flex px-6 py-3 text-xs font-display font-medium tracking-[0.1em] uppercase bg-foreground text-background hover:bg-data hover:text-foreground transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Visit the Lab
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavSection({
  section,
  index,
  onNavigate,
}: {
  section: (typeof navigation)[0];
  index: number;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full text-left group"
      >
        <span className="text-[11px] font-mono text-muted-foreground/50">
          {section.number}
        </span>
        <span className="font-display text-xl font-bold tracking-tight group-hover:text-data transition-colors">
          {section.label}
        </span>
        <span
          className={cn(
            "text-muted-foreground/40 text-xs ml-auto transition-transform duration-200",
            expanded && "rotate-180"
          )}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="ml-8 mt-3 space-y-2">
          {section.children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
