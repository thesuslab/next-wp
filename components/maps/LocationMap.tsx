import React from "react";

interface LocationMapProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function LocationMap({
  title = "Maharajgunj Research Station",
  subtitle = "Maharajgunj, Kathmandu, Nepal • Coordinates: 27.7408° N, 85.3365° E",
  className = "",
}: LocationMapProps) {
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1678.257342019198!2d85.33648295827483!3d27.74082380807615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sne!2snp!4v1789039034476!5m2!1sne!2snp";

  const googleMapsDirectionsUrl =
    "https://www.google.com/maps/search/?api=1&query=27.74082380807615,85.33648295827483";

  return (
    <div
      className={`rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg transition-all duration-300 hover:border-bamboo/40 ${className}`}
    >
      {/* Header bar */}
      <div className="p-6 border-b border-border/40 flex flex-wrap items-center justify-between gap-4 bg-muted/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-bamboo animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-bamboo font-semibold">
              ACTIVE RESEARCH STATION
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-bamboo hover:text-bamboo-light border border-bamboo/30 hover:border-bamboo px-3.5 py-2 rounded-lg bg-bamboo/5 hover:bg-bamboo/10 transition-all duration-200"
          >
            <span>Open in Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Embedded Map */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-muted/10">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Sustainability Lab Maharajgunj Station Map"
          className="w-full h-full grayscale contrast-[1.08] dark:invert-[0.92] dark:hue-rotate-180 transition-all duration-300"
        />

        {/* Floating Telemetry Pin Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border/60 shadow-xl text-xs font-mono">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-foreground font-bold">Maharajgunj Hub</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-bamboo/10 text-bamboo border border-bamboo/20">
              STATION 01
            </span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Maharajgunj, Kathmandu Valley, Nepal. Living hydrological modeling,
            circular craft studio, and collaborative workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
