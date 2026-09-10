// Sustainability Lab — Navigation Architecture

export interface NavItem {
  label: string;
  href: string;
}

export interface NavSection {
  number: string;
  label: string;
  href: string;
  children: NavItem[];
}

export const navigation: NavSection[] = [
  {
    number: "01",
    label: "THE LAB",
    href: "/lab",
    children: [
      { label: "About", href: "/lab" },
      { label: "Our Approach", href: "/lab/approach" },
      { label: "People", href: "/lab/people" },
      { label: "Work", href: "/lab/work" },
      { label: "Insights", href: "/lab/insights" },
    ],
  },
  {
    number: "02",
    label: "INTELLIGENCE",
    href: "/intelligence",
    children: [
      { label: "Environmental Intelligence", href: "/intelligence/environmental" },
      { label: "Climate Intelligence", href: "/intelligence/climate" },
      { label: "AI Intelligence Engine", href: "/intelligence/ai" },
      { label: "Knowledge", href: "/intelligence/knowledge" },
      { label: "Tools", href: "/intelligence/tools" },
    ],
  },
  {
    number: "03",
    label: "RESILIENCE",
    href: "/resilience",
    children: [
      { label: "Green Infrastructure", href: "/resilience/green-infrastructure" },
      { label: "Climate Adaptation", href: "/resilience/climate-adaptation" },
      { label: "Disaster Risk Reduction", href: "/resilience/disaster-risk" },
      { label: "Natural Resources", href: "/resilience/natural-resources" },
      { label: "Safeguards", href: "/resilience/safeguards" },
    ],
  },
  {
    number: "04",
    label: "ENTERPRISE",
    href: "/enterprise",
    children: [
      { label: "AI Incubation", href: "/enterprise/ai-incubation" },
      { label: "Enterprise Diagnostics", href: "/enterprise/diagnostics" },
      { label: "Business Planning", href: "/enterprise/planning" },
      { label: "Financial Readiness", href: "/enterprise/finance" },
      { label: "Market Intelligence", href: "/enterprise/market" },
      { label: "Mentorship", href: "/enterprise/mentorship" },
    ],
  },
  {
    number: "05",
    label: "KĀRVA",
    href: "/karva",
    children: [
      { label: "About KĀRVA", href: "/karva" },
      { label: "Materials", href: "/karva/materials" },
      { label: "Products / Experiments", href: "/karva/products" },
      { label: "Stories", href: "/karva/stories" },
    ],
  },
  {
    number: "06",
    label: "COMMUNITY",
    href: "/community",
    children: [
      { label: "Coworking", href: "/community/coworking" },
      { label: "Events", href: "/community/events" },
      { label: "Members", href: "/community/members" },
      { label: "Researchers", href: "/community/researchers" },
      { label: "Entrepreneurs", href: "/community/entrepreneurs" },
    ],
  },
  {
    number: "07",
    label: "COLLABORATE",
    href: "/collaborate",
    children: [
      { label: "Partnerships", href: "/collaborate/partnerships" },
      { label: "Projects", href: "/collaborate/projects" },
      { label: "Opportunities", href: "/collaborate/opportunities" },
      { label: "Contact", href: "/collaborate/contact" },
    ],
  },
];

// Flat menu exports for backward compatibility
export const mainMenu: Record<string, string> = {};
navigation.forEach((section) => {
  mainMenu[section.label.toLowerCase()] = section.href;
});

export const contentMenu = {
  "field notes": "/lab/insights",
  knowledge: "/intelligence/knowledge",
  work: "/lab/work",
};
