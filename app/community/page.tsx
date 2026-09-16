"use client";

import { useState } from "react";
import Link from "next/link";
import { LocationMap } from "@/components/maps/LocationMap";

interface CommunityEvent {
  id: string;
  type: "WORKSHOP" | "CLIMATE MEETUP" | "DEMO DAY" | "RESEARCH TALK" | "OPEN LAB";
  title: string;
  date: string;
  time: string;
  lead: string;
  description: string;
  seats: string;
}

const events: CommunityEvent[] = [
  {
    id: "evt-01",
    type: "OPEN LAB",
    title: "Hydrological Modeling & Open Sensor Tinkering",
    date: "Thursday, Sept 18",
    time: "4:00 PM — 7:00 PM",
    lead: "Dr. B. Gautam, Lab Sensor Fellow",
    description: "Hands-on session assembling low-cost acoustic ultrasonic stream gauges and connecting them to our decentralized telemetry grid.",
    seats: "8 seats remaining",
  },
  {
    id: "evt-02",
    type: "CLIMATE MEETUP",
    title: "Kathmandu Climate Founders Circle",
    date: "Friday, Sept 26",
    time: "5:30 PM — 8:00 PM",
    lead: "Ecosystem Host: Ashutosh Gautam",
    description: "Informal evening connecting 30+ early-stage climate entrepreneurs, circular material designers, and grant partners over tea.",
    seats: "Open RSVP",
  },
  {
    id: "evt-03",
    type: "WORKSHOP",
    title: "Bio-Material Prototyping with Agricultural Straw",
    date: "Saturday, Oct 04",
    time: "10:00 AM — 2:00 PM",
    lead: "KĀRVA Master Craftsman",
    description: "Learn compression molding techniques, natural resin binders, and test structural integrity in the physical workshop.",
    seats: "4 seats remaining",
  },
  {
    id: "evt-04",
    type: "RESEARCH TALK",
    title: "Non-Linear Monsoon Tipping Points in the Hindu Kush Himalaya",
    date: "Wednesday, Oct 15",
    time: "5:00 PM — 6:30 PM",
    lead: "Visiting Research Fellow (ICIMOD / Lab)",
    description: "Presentation of high-resolution climate downscaling datasets and discussion on glacier outburst flood mitigation.",
    seats: "Hybrid / In-Person",
  },
];

const personas = [
  { role: "Climate Startups", desc: "Build your product with access to prototyping benches and real-world testing grounds." },
  { role: "Researchers", desc: "Turn evidence and datasets into physical interventions and policy whitepapers." },
  { role: "Technologists & Engineers", desc: "Develop IoT sensors, AI models, and spatial GIS pipelines for difficult problems." },
  { role: "Designers & Architects", desc: "Explore vernacular bio-materials, circular joinery, and sustainable human spaces." },
  { role: "Independent Specialists", desc: "Work alongside peers across economics, ecology, and engineering." },
  { role: "Social Enterprises", desc: "Scale localized community impact with commercial and blended finance guidance." },
];

export default function CommunityPage() {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [rsvpEvent, setRsvpEvent] = useState<CommunityEvent | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpWork, setRsvpWork] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpEmail.trim() || !rsvpEvent) return;
    setRsvpSubmitting(true);
    setRsvpError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "Workshop & Session RSVP",
          name: rsvpName.trim(),
          email: rsvpEmail.trim(),
          primaryDetails: `RSVP for: ${rsvpEvent.title} (${rsvpEvent.date} • ${rsvpEvent.time}) at Maharajgunj Lab Station.`,
          secondaryDetails: rsvpWork.trim() ? `Work / Research Focus: ${rsvpWork.trim()}` : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to submit RSVP.");
      }

      setRsvpSuccess(true);
    } catch (err: any) {
      setRsvpError(err.message || "Something went wrong. Please try again.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const filteredEvents = selectedType === "ALL"
    ? events
    : events.filter((e) => e.type === selectedType);

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/" className="hover:text-data transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">COMMUNITY</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-foreground/5 text-foreground border border-border rounded-full mb-6">
            06 • THE PHYSICAL COMMONS
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            A WORKSPACE FOR PEOPLE <br />
            <span className="text-data">WHO CARE ABOUT WHAT HAPPENS NEXT.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Not generic coworking. The Lab is an active laboratory, workshop, and shared workspace in Maharajgunj, Kathmandu for climate builders, researchers, founders, and curious practitioners.
          </p>
        </div>

        {/* Who it's for Grid */}
        <div className="mb-20">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 pb-4 border-b border-border/40">
            WHO BELONGS HERE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border/70 hover:border-data/40 transition-colors"
              >
                <h3 className="font-display font-bold text-lg mb-2 text-foreground">
                  {persona.role}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {persona.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get / Amenities */}
        <div className="p-8 sm:p-10 rounded-2xl bg-card border border-border mb-20 shadow-lg">
          <div className="text-xs font-mono text-data uppercase tracking-wider mb-2">
            PHYSICAL &amp; KNOWLEDGE INFRASTRUCTURE
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">
            What You Get
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 font-mono text-xs">
            <div className="p-4 rounded-xl bg-background border border-border/60">
              <div className="text-data font-bold mb-2">01 / A DESK</div>
              <p className="text-muted-foreground font-sans text-xs">
                Ergonomic salvaged-wood workbenches, dual 4K monitors, high-speed fiber, quiet research booths.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border/60">
              <div className="text-data font-bold mb-2">02 / A NETWORK</div>
              <p className="text-muted-foreground font-sans text-xs">
                Direct daily proximity to environmental consultants, AI developers, and visiting fellows.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border/60">
              <div className="text-data font-bold mb-2">03 / A PLACE TO MEET</div>
              <p className="text-muted-foreground font-sans text-xs">
                Bookable workshop rooms, hybrid video conference hubs, and an open courtyard for evening talks.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border/60">
              <div className="text-data font-bold mb-2">04 / EXPERIMENT</div>
              <p className="text-muted-foreground font-sans text-xs">
                Access to the KĀRVA materials workshop, 3D printers, precision hand tools, and sensor testing bench.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border/60">
              <div className="text-data font-bold mb-2">05 / COMMUNITY</div>
              <p className="text-muted-foreground font-sans text-xs">
                Weekly community lunches, peer code reviews, prototype critiques, and collaborative grant proposals.
              </p>
            </div>
          </div>
        </div>

        {/* Community Calendar */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border/40">
            <div>
              <div className="text-xs font-mono text-data uppercase tracking-wider mb-1">
                PUBLIC SESSIONS &amp; WORKSHOPS
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                Community Calendar
              </h2>
            </div>

            {/* Event Filter */}
            <div className="flex flex-wrap gap-2">
              {["ALL", "OPEN LAB", "CLIMATE MEETUP", "WORKSHOP", "RESEARCH TALK"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                    selectedType === type
                      ? "bg-data text-black font-semibold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-xl bg-card border border-border/70 hover:border-data/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-muted text-foreground text-[10px]">
                      {evt.type}
                    </span>
                    <span className="text-data font-semibold">{evt.date}</span>
                    <span className="text-muted-foreground">{evt.time}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-foreground">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    {evt.description}
                  </p>

                  <div className="text-[11px] font-mono text-muted-foreground">
                    Host: <span className="text-foreground">{evt.lead}</span> • <span className="text-data">{evt.seats}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRsvpEvent(evt);
                    setRsvpSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-data hover:text-black transition-colors shrink-0"
                >
                  RSVP for Session →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Maharajgunj Station Map */}
        <LocationMap className="mt-20" />

        {/* RSVP Modal */}
        {rsvpEvent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full font-mono text-xs shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-data uppercase tracking-widest">
                  SESSION RSVP
                </span>
                <button
                  onClick={() => setRsvpEvent(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <h4 className="font-display font-bold text-base text-foreground mb-2">
                {rsvpEvent.title}
              </h4>
              <p className="text-muted-foreground text-xs font-sans mb-6">
                {rsvpEvent.date} • {rsvpEvent.time} at Maharajgunj Lab Station.
              </p>

              {rsvpSuccess ? (
                <div className="p-4 rounded-lg bg-bamboo/10 border border-bamboo/30 text-bamboo text-center font-mono text-xs">
                  ✓ Seat confirmed! We sent an invitation to your calendar.
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  {rsvpError && (
                    <div className="p-3 rounded bg-crimson/10 border border-crimson/30 text-crimson text-xs font-mono">
                      {rsvpError}
                    </div>
                  )}
                  <div>
                    <label className="block text-muted-foreground mb-1 text-xs font-mono uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Maya Shrestha"
                      className="w-full px-3 py-2 rounded bg-background border border-border text-foreground focus:border-data focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 text-xs font-mono uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full px-3 py-2 rounded bg-background border border-border text-foreground focus:border-data focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 text-xs font-mono uppercase tracking-wider">
                      What are you working on?
                    </label>
                    <input
                      type="text"
                      value={rsvpWork}
                      onChange={(e) => setRsvpWork(e.target.value)}
                      placeholder="Hydrological research, startup, etc."
                      className="w-full px-3 py-2 rounded bg-background border border-border text-foreground focus:border-data focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={rsvpSubmitting}
                    className="w-full py-3 rounded bg-data text-black font-bold uppercase tracking-wider hover:bg-data/90 transition-colors disabled:opacity-50 text-xs"
                  >
                    {rsvpSubmitting ? "Confirming Seat..." : "Confirm RSVP →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
