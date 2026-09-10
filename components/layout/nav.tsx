"use client";

import { useState, useEffect } from "react";
import { navigation, type NavSection } from "@/menu.config";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/nav/mobile-nav";
import { useLabLens } from "@/components/lens/LabLensContext";
import Link from "next/link";
import Image from "next/image";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { isOpen, toggleLens } = useLabLens();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed z-50 top-0 left-0 right-0 transition-all duration-500",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/50"
            : "bg-transparent",
          className
        )}
        id={id}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div
          id="nav-container"
          className="max-w-[1400px] mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
        >
          {/* Logo */}
          <Link
            className="hover:opacity-85 transition-all flex items-center gap-3 group py-0.5"
            href="/"
            aria-label="Sustainability Lab Homepage"
          >
            <div className="relative h-9 sm:h-10 w-auto flex items-center">
              <Image
                src="/logo-transparent.png"
                alt="The Sustainability Lab"
                width={177}
                height={80}
                priority
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] dark:brightness-110"
              />
            </div>
          </Link>

          {children}

          {/* Desktop Navigation */}
          <div className="flex items-center gap-1">
            <div className="hidden lg:flex items-center gap-0">
              {navigation.map((section) => (
                <NavMenuItem
                  key={section.number}
                  section={section}
                  isActive={activeMenu === section.number}
                  onHover={() => setActiveMenu(section.number)}
                />
              ))}
            </div>
            <button
              onClick={toggleLens}
              aria-label="Toggle Lab Lens Intelligence"
              className={cn(
                "hidden xl:inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase border transition-all duration-200 ml-2 rounded-full",
                isOpen
                  ? "bg-data text-black border-data shadow-[0_0_15px_rgba(0,212,170,0.5)]"
                  : "text-foreground/80 border-border/60 hover:border-data hover:text-data"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", isOpen ? "bg-black" : "bg-data animate-pulse")} />
              <span>◉ LAB LENS</span>
            </button>
            <Link
              href="/collaborate/contact"
              className="hidden sm:inline-flex ml-3 px-5 py-2 text-xs font-display font-medium tracking-[0.1em] uppercase bg-foreground text-background hover:bg-bamboo hover:text-white transition-all duration-300"
            >
              Visit the Lab
            </Link>
            <MobileNav />
          </div>
        </div>

        {/* Mega menu dropdown */}
        {activeMenu && (
          <MegaMenu
            section={navigation.find((s) => s.number === activeMenu)!}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </nav>
      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-[64px]" />
    </>
  );
}

function NavMenuItem({
  section,
  isActive,
  onHover,
}: {
  section: NavSection;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onHover}>
      <Link
        href={section.href}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 text-[11px] font-display font-medium tracking-[0.1em] uppercase transition-all duration-200",
          isActive
            ? "text-bamboo font-semibold"
            : "text-foreground/75 hover:text-bamboo"
        )}
      >
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {section.number}
        </span>
        {section.label}
      </Link>
    </div>
  );
}

function MegaMenu({
  section,
  onClose,
}: {
  section: NavSection;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border/30 animate-fade-in"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-8">
        <div className="grid grid-cols-[200px_1fr] gap-12">
          <div>
            <span className="text-[10px] font-mono text-bamboo block mb-1">
              {section.number}
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {section.label}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
            {section.children.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-bamboo transition-colors duration-200 py-1"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
