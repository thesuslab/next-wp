import { ThemeToggle } from "@/components/theme/theme-toggle";
import { navigation } from "@/menu.config";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block group" aria-label="Sustainability Lab Home">
              <Image
                src="/logo-transparent.png"
                alt="The Sustainability Lab"
                width={200}
                height={90}
                className="h-14 w-auto object-contain mb-3 transition-opacity group-hover:opacity-85 dark:brightness-110"
              />
            </Link>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm font-mono text-xs">
              Intelligence for a resilient future.
            </p>
            <Link
              href="/our-story"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-bamboo hover:underline mt-3"
            >
              Read our story →
            </Link>
          </div>
          <ThemeToggle />
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-16">
          <Link
            href="/our-story"
            className="text-[11px] font-display font-bold tracking-[0.15em] uppercase text-bamboo hover:text-bamboo-light transition-colors duration-200"
          >
            Our Story
          </Link>
          {navigation.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="text-[11px] font-display font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-bamboo transition-colors duration-200"
            >
              {section.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-10">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <p className="text-sm text-muted-foreground/60 mb-1">
                Research. Experiment. Collaborate. Build.
              </p>
              <p className="text-xs text-muted-foreground/40">
                Kathmandu, Nepal
              </p>
              <p className="text-xs text-muted-foreground/40">
                hello@sustainabilitylab.org
              </p>
            </div>
            <p className="font-display text-sm text-bamboo font-medium italic">
              Let&apos;s make the future less fragile.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
