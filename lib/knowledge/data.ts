export interface KnowledgeSource {
  name: string;
  url: string;
  date: string;
  type: string;
  level: "primary" | "synthesis";
}

export interface ClimateDataMetric {
  period?: string;
  annualTemperatureC?: number;
  annualPrecipitationMm?: number;
  dataset?: string;
  startYear?: number;
  temperatureChangeCPerDecade?: number;
  precipitationChangeMmPerDecade?: number;
  scenario?: string;
  temperatureMedianC?: number;
  temperatureP10C?: number;
  temperatureP90C?: number;
  precipitationMedianMm?: number;
  precipitationP10Mm?: number;
  precipitationP90Mm?: number;
  [key: string]: any;
}

export interface KnowledgeEntry {
  id: string;
  slug: string;
  title: string;
  kind: "knowledge" | "documentation" | "research";
  summary: string;
  body: string;
  topic: string;
  category: "Climate" | "Infrastructure" | "Enterprise" | "Environment" | "Policy" | "Tools" | "Case Studies";
  region: string;
  locality: string | null;
  country: string;
  source: KnowledgeSource;
  tags: string[];
  data: ClimateDataMetric | null;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
}

export const sources: Record<string, KnowledgeSource> = {
  ndc: {
    name: "Government of Nepal — Second Nationally Determined Contribution",
    url: "https://unfccc.int/sites/default/files/NDC/2022-06/Second%20Nationally%20Determined%20Contribution%20%28NDC%29%20-%202020.pdf",
    date: "2020-12-08",
    type: "national policy document",
    level: "primary",
  },
  icimod: {
    name: "ICIMOD — The Hindu Kush Himalaya Assessment",
    url: "https://www.icimod.org/hkhassessment/",
    date: "2019-02-04",
    type: "regional assessment",
    level: "synthesis",
  },
  health: {
    name: "World Bank — Nepal Climate and Health Vulnerability Assessment",
    url: "https://openknowledge.worldbank.org/entities/publication/f3a311d2-791b-4511-8a4c-d12605842d11",
    date: "2024-07-09",
    type: "country assessment",
    level: "primary",
  },
  cckp: {
    name: "World Bank — Climate Change Knowledge Portal: Nepal",
    url: "https://climateknowledgeportal.worldbank.org/country/nepal",
    date: "2026",
    type: "climate data portal",
    level: "primary",
  },
  nap: {
    name: "Government of Nepal / UNFCCC — National Adaptation Plan Summary",
    url: "https://unfccc.int/sites/default/files/resource/NAP_Nepal_Summary_for_Policy_Makers.pdf",
    date: "2021",
    type: "adaptation planning document",
    level: "primary",
  },
  cddr: {
    name: "World Bank — Nepal Country Climate and Development Report",
    url: "https://openknowledge.worldbank.org/entities/publication/7b6f49e3-5431-5d48-94bb-c22ac1d3dcd1",
    date: "2022",
    type: "country development report",
    level: "synthesis",
  },
  adb: {
    name: "Asian Development Bank — Climate Risk Country Profile: Nepal",
    url: "https://www.adb.org/publications/climate-risk-country-profile-nepal",
    date: "2021",
    type: "climate risk profile",
    level: "synthesis",
  },
  who: {
    name: "World Health Organization — Health and Climate Change Country Profiles",
    url: "https://www.who.int/teams/environment-climate-change-and-health/climate-change-and-health/evidence-monitoring/country-profiles",
    date: "2022",
    type: "health evidence profile",
    level: "synthesis",
  },
};

function mapTopicToCategory(topic: string): KnowledgeEntry["category"] {
  switch (topic.toLowerCase()) {
    case "climate policy":
    case "adaptation planning":
      return "Policy";
    case "energy transition":
    case "mobility":
    case "urban systems":
      return "Infrastructure";
    case "forests and biodiversity":
    case "water systems":
    case "food and land":
      return "Environment";
    case "climate and development":
      return "Enterprise";
    case "cryosphere":
    case "hazards and resilience":
    case "climate and health":
    case "climate data":
    case "risk literacy":
      return "Climate";
    case "field methods":
    case "climate communication":
    case "research practice":
    case "adaptation practice":
      return "Tools";
    default:
      return "Climate";
  }
}

function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

interface RawEntryInput {
  id: string;
  title: string;
  slug: string;
  kind: "knowledge" | "documentation" | "research";
  summary: string;
  body: string;
  topic: string;
  region?: string;
  locality?: string | null;
  source: KnowledgeSource;
  tags: string[];
  data?: ClimateDataMetric | null;
}

function createEntry(input: RawEntryInput): KnowledgeEntry {
  const region = input.region || "Hindu Kush Himalaya";
  const locality = input.locality || null;
  const readTime = calculateReadTime(input.body + " " + input.summary);
  const category = mapTopicToCategory(input.topic);

  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    kind: input.kind,
    summary: input.summary,
    body: input.body,
    topic: input.topic,
    category,
    region,
    locality,
    country: "Nepal",
    source: input.source,
    tags: input.tags,
    data: input.data || null,
    readTime,
    seoTitle: `${input.title} | Sustainability Lab Nepal`,
    seoDescription: input.summary,
  };
}

export const knowledgeEntries: KnowledgeEntry[] = [
  createEntry({
    id: "kb-01",
    title: "Nepal’s climate policy begins with vulnerability and agency",
    slug: "nepal-climate-policy-vulnerability-agency",
    kind: "knowledge",
    summary: "How Nepal’s national climate commitment frames vulnerability, responsibility, and the need for collective action.",
    body: `Nepal’s Second NDC connects climate action to the country’s fragile topography, climate-sensitive livelihoods, and limited adaptive capacity. The document also makes a political argument: a country with negligible emissions still has a direct interest in ambitious global mitigation because lower warming lowers risk at home.

Read this as a framing document, not a scorecard. The NDC sets intentions and targets for 2021–2030; it does not by itself demonstrate delivery.`,
    topic: "Climate policy",
    source: sources.ndc,
    tags: ["NDC", "policy", "climate justice", "Nepal"],
  }),
  createEntry({
    id: "kb-02",
    title: "Net zero as a long-horizon design constraint",
    slug: "nepal-net-zero-2050-strategy",
    kind: "documentation",
    summary: "The long-term low-emission direction stated in Nepal’s Second NDC and what it means for infrastructure choices today.",
    body: `Nepal’s Second NDC describes an ambition to achieve net-zero greenhouse-gas emissions by 2050. For practitioners, the value of a long-horizon target is not a promise that every pathway is known; it is a constraint that can shape energy, transport, land-use, and public-investment decisions now.

Any implementation plan should pair the target with transparent milestones, finance conditions, and local accountability.`,
    topic: "Climate policy",
    source: sources.ndc,
    tags: ["net zero", "long-term strategy", "mitigation", "Nepal"],
  }),
  createEntry({
    id: "kb-03",
    title: "Clean energy targets: ambition, conditionality, and delivery",
    slug: "nepal-clean-energy-targets-2030",
    kind: "research",
    summary: "A source-grounded reading of Nepal’s 2030 clean-energy generation and energy-supply targets.",
    body: `The Second NDC sets activity-based targets for expanding clean-energy generation and increasing the share of total energy demand supplied by clean sources. It distinguishes an unconditional component from targets that depend on international support.

That distinction matters for honest communication. A target can be ambitious and still require a delivery architecture: finance, transmission, procurement, maintenance, and locally trusted institutions.`,
    topic: "Energy transition",
    source: sources.ndc,
    tags: ["clean energy", "hydropower", "solar", "finance"],
  }),
  createEntry({
    id: "kb-04",
    title: "Electric mobility in Nepal’s national plan",
    slug: "nepal-electric-mobility-ndc",
    kind: "documentation",
    summary: "What Nepal’s Second NDC says about electric vehicles, rail, and fossil-fuel dependence in transport.",
    body: `Nepal’s Second NDC includes targets for electric-vehicle sales, electric public transport, and the development of an electric rail network. These measures sit inside a broader systems question: transport decarbonization depends on reliable power, charging access, affordability, road safety, and the needs of people who cannot quickly switch vehicles.

The NDC’s modeled reductions are projections linked to stated targets, not observed emissions outcomes.`,
    topic: "Mobility",
    source: sources.ndc,
    tags: ["electric vehicles", "rail", "transport", "urban systems"],
  }),
  createEntry({
    id: "kb-05",
    title: "Cooking, biogas, and the dignity of household energy",
    slug: "nepal-clean-cooking-biogas",
    kind: "knowledge",
    summary: "A humane reading of Nepal’s clean-cooking targets through health, time, affordability, and emissions.",
    body: `The NDC includes targets for electric stoves, improved cookstoves, and household and large-scale biogas plants. Clean cooking is not only an emissions story: it touches indoor air, unpaid labor, household budgets, reliability, and the autonomy of people who cook.

The best intervention is rarely a single technology. It is a locally maintained choice set that works through seasons, outages, fuel prices, and household realities.`,
    topic: "Energy transition",
    source: sources.ndc,
    tags: ["clean cooking", "biogas", "households", "health"],
  }),
  createEntry({
    id: "kb-06",
    title: "Forest cover is a social system, not a number",
    slug: "nepal-forest-cover-community-governance",
    kind: "research",
    summary: "How Nepal’s NDC connects forest cover with community management, safeguards, and equitable benefit sharing.",
    body: `Nepal’s Second NDC links forest-cover goals to sustainable management, community-based forestry, REDD+ finance, and environmental and social safeguards. It calls for meaningful representation and benefit sharing involving local communities, women, Dalit communities, and Indigenous Peoples.

The lesson for a knowledge portal is simple: forest metrics should be accompanied by governance context, tenure, access, and who benefits from conservation.`,
    topic: "Forests and biodiversity",
    source: sources.ndc,
    tags: ["forests", "community forestry", "REDD+", "equity"],
  }),
  createEntry({
    id: "kb-07",
    title: "Watersheds as living infrastructure",
    slug: "nepal-watershed-health-ndc",
    kind: "knowledge",
    summary: "Why watershed health appears in Nepal’s climate plan and how to read it as an adaptation priority.",
    body: `The NDC includes a goal to upgrade watershed health and vitality in at least 20 districts and to manage vulnerable wetlands. These are not isolated conservation tasks. Watersheds connect slope stability, groundwater, agriculture, biodiversity, settlement, and downstream water security.

A useful watershed intervention therefore combines ecological restoration with local monitoring, maintenance budgets, and decisions made at the scale of the basin.`,
    topic: "Water systems",
    source: sources.ndc,
    tags: ["watersheds", "wetlands", "restoration", "adaptation"],
  }),
  createEntry({
    id: "kb-08",
    title: "Climate-smart farms need access, not only labels",
    slug: "nepal-climate-smart-agriculture-farms",
    kind: "documentation",
    summary: "The agricultural targets in Nepal’s NDC and the enabling conditions behind climate-smart practice.",
    body: `Nepal’s NDC describes climate-smart villages and farms, improved cattle sheds, organic fertilizer production, soil organic matter, agroforestry, conservation tillage, and broader access to climate-smart technologies. The plan also names women, Indigenous Peoples, and smallholder farmers as groups whose access must increase.

The operational question is distribution: who can obtain the knowledge, tools, credit, labor, and extension support needed to make a practice work locally?`,
    topic: "Food and land",
    source: sources.ndc,
    tags: ["agriculture", "food systems", "soil", "smallholders"],
  }),
  createEntry({
    id: "kb-09",
    title: "Wastewater and faecal sludge as climate infrastructure",
    slug: "nepal-wastewater-faecal-sludge-climate",
    kind: "documentation",
    summary: "A field-oriented interpretation of Nepal’s wastewater and faecal-sludge management targets.",
    body: `The Second NDC includes targets for wastewater treatment and faecal-sludge management. The climate relevance is direct, but so is the public-health relevance: sanitation systems are only protective when collection, treatment, worker safety, governance, and maintenance operate together.

This is an example of a high-leverage intervention that can be discussed without spectacle. Better treatment protects waterways, reduces exposure, and makes urban services more trustworthy.`,
    topic: "Urban systems",
    region: "Nepal",
    locality: "Kathmandu Valley",
    source: sources.ndc,
    tags: ["wastewater", "sanitation", "cities", "public health"],
  }),
  createEntry({
    id: "kb-10",
    title: "The Hindu Kush Himalaya assessment: a shared evidence base",
    slug: "hkh-assessment-shared-evidence-base",
    kind: "research",
    summary: "What the first comprehensive Hindu Kush Himalaya assessment brought together and why its regional scale matters.",
    body: `ICIMOD describes its Hindu Kush Himalaya Assessment as a first-of-its-kind regional synthesis involving more than 350 scientists and researchers across 16 chapters. Its scope spans climate drivers and impacts, food, water, energy, biodiversity, poverty, gender, and migration.

The region is not a single climate or a single community. Use the assessment to connect systems, then return to local sources before making a place-specific claim.`,
    topic: "Regional assessment",
    source: sources.icimod,
    tags: ["HKH", "ICIMOD", "systems", "regional science"],
  }),
  createEntry({
    id: "kb-11",
    title: "Mountain warming and the limits of a global average",
    slug: "mountain-warming-hkh-global-average",
    kind: "knowledge",
    summary: "Why mountain climate communication should distinguish global temperature goals from mountain-specific risk.",
    body: `ICIMOD’s assessment overview emphasizes that warming in mountain environments can outpace global averages. That framing is useful because a global mean is a coordination target, not a description of every landscape or lived experience.

Public communication should pair regional projections with local observations and explain what is known, what is modeled, and what remains uncertain.`,
    topic: "Cryosphere",
    source: sources.icimod,
    tags: ["mountains", "warming", "uncertainty", "communication"],
  }),
  createEntry({
    id: "kb-12",
    title: "Glaciers as water towers—and why that metaphor needs care",
    slug: "hkh-glaciers-water-towers",
    kind: "research",
    summary: "A source-grounded introduction to glacier change, downstream water, and the social meaning of cryosphere risk.",
    body: `The HKH assessment describes glacier systems as essential to downstream populations and warns that glacier change can have far-reaching consequences. The useful insight is not that every downstream community faces the same future, but that cryosphere change can reorganize water timing, hazards, infrastructure, and livelihoods across connected basins.

A humane response prioritizes monitoring, early warning, safe infrastructure, and the agency of communities living with the change.`,
    topic: "Cryosphere",
    source: sources.icimod,
    tags: ["glaciers", "water security", "downstream", "adaptation"],
  }),
  createEntry({
    id: "kb-13",
    title: "Monsoon variability, floods, landslides, and drought",
    slug: "hkh-monsoon-variability-hazards",
    kind: "documentation",
    summary: "How the HKH assessment links shorter intense rainfall periods, drought, and cascading mountain hazards.",
    body: `The ICIMOD assessment overview points to changing monsoon patterns, including heavier rainfall over shorter periods alongside prolonged drought. In steep terrain, the implications can cascade through floods, landslides, roads, farms, and settlements.

Risk communication should avoid treating a hazard as destiny. Exposure mapping, maintenance, early warning, evacuation planning, and locally trusted response systems can change outcomes.`,
    topic: "Hazards and resilience",
    region: "Hindu Kush Himalaya",
    locality: "Koshi and Gandaki basins",
    source: sources.icimod,
    tags: ["monsoon", "floods", "landslides", "drought"],
  }),
  createEntry({
    id: "kb-14",
    title: "Climate risk is hazard plus exposure plus vulnerability",
    slug: "climate-risk-hazard-exposure-vulnerability",
    kind: "documentation",
    summary: "A practical guide to reading climate risk without confusing a weather event with its social consequences.",
    body: `The World Bank Climate Change Knowledge Portal presents climate risk through interactions among hazards, exposure, vulnerability, and adaptive capacity. This is a powerful editorial discipline: the same rainfall event can have different consequences depending on topography, housing, livelihoods, infrastructure, governance, and access to care.

Use the framework to ask better questions rather than to label communities as inherently vulnerable.`,
    topic: "Risk literacy",
    region: "Nepal",
    source: sources.cckp,
    tags: ["risk", "exposure", "vulnerability", "adaptive capacity"],
  }),
  createEntry({
    id: "kb-15",
    title: "Nepal’s historical climate baseline",
    slug: "nepal-historical-climate-baseline-1995-2014",
    kind: "research",
    summary: "The World Bank CCKP baseline values for Nepal, with the period and dataset clearly labeled.",
    body: `For Nepal’s 1995–2014 historical period, the World Bank Climate Change Knowledge Portal reports an annual temperature of 12.66 °C and annual precipitation of 2042.28 mm. These values are national-scale baseline summaries from the portal, not a substitute for station data or a local climatology.

Their value is as a reference point for comparing future projections, provided the period, dataset, and scale stay visible.`,
    topic: "Climate data",
    region: "Nepal",
    source: sources.cckp,
    tags: ["baseline", "temperature", "precipitation", "ERA5"],
    data: {
      period: "1995-2014",
      annualTemperatureC: 12.66,
      annualPrecipitationMm: 2042.28,
    },
  }),
  createEntry({
    id: "kb-16",
    title: "Observed temperature and precipitation trends since 1970",
    slug: "nepal-observed-climate-trends-since-1970",
    kind: "research",
    summary: "World Bank CCKP trend values for Nepal, presented with dataset and unit discipline.",
    body: `Using ERA5, the World Bank Climate Change Knowledge Portal reports a temperature shift of 0.17 °C per decade and a precipitation-pattern change of 40.14 mm per decade since 1970. The portal’s wording and dataset label matter: these are modeled/reanalysis trend summaries, not a claim that every place in Nepal changed identically.

Use them to motivate deeper local investigation, not to erase local variation.`,
    topic: "Climate data",
    region: "Nepal",
    source: sources.cckp,
    tags: ["trend", "ERA5", "temperature", "precipitation"],
    data: {
      dataset: "ERA5",
      startYear: 1970,
      temperatureChangeCPerDecade: 0.17,
      precipitationChangeMmPerDecade: 40.14,
    },
  }),
  createEntry({
    id: "kb-17",
    title: "Mid-century projection: show the range, not only the median",
    slug: "nepal-mid-century-projection-ssp370",
    kind: "documentation",
    summary: "A transparent explanation of the World Bank CCKP’s Nepal mid-century SSP3-7.0 projection and uncertainty range.",
    body: `For 2040–2059 under the high-emission SSP3-7.0 scenario, the World Bank CCKP reports a median temperature change of 1.5 °C with a p10–p90 range of 1.1–2.01 °C relative to 1995–2014. It reports a median precipitation change of 129.58 mm with a p10–p90 range of -72.55 to 539.67 mm.

A responsible visualization keeps the range visible. A median is a useful summary; it is not the only plausible outcome.`,
    topic: "Climate data",
    region: "Nepal",
    source: sources.cckp,
    tags: ["projection", "SSP3-7.0", "uncertainty", "2040-2059"],
    data: {
      scenario: "SSP3-7.0",
      period: "2040-2059",
      temperatureMedianC: 1.5,
      temperatureP10C: 1.1,
      temperatureP90C: 2.01,
      precipitationMedianMm: 129.58,
      precipitationP10Mm: -72.55,
      precipitationP90Mm: 539.67,
    },
  }),
  createEntry({
    id: "kb-18",
    title: "Climate-health vulnerability in Nepal: an assessment lens",
    slug: "nepal-climate-health-vulnerability-assessment",
    kind: "research",
    summary: "What the World Bank’s 2024 Nepal Climate and Health Vulnerability Assessment was designed to help decision-makers do.",
    body: `The World Bank’s assessment describes Nepal’s exposure to variable torrential rainfall, heavy monsoons, extreme heat and cold, steep terrain, floods including glacial lake outburst floods, landslides, droughts, and waterborne diseases. It was designed to support decision-makers and subnational health planners in planning adaptation measures.

The humane editorial frame is practical: climate-health information should lead to stronger systems, accessible care, safer water, and better disaster-risk management—not fear without an action pathway.`,
    topic: "Climate and health",
    region: "Nepal",
    source: sources.health,
    tags: ["health", "floods", "waterborne disease", "adaptation"],
  }),
  createEntry({
    id: "kb-19",
    title: "Why health risk is also a question of remoteness and poverty",
    slug: "nepal-climate-health-remoteness-poverty",
    kind: "knowledge",
    summary: "A structured reading of the World Bank assessment’s vulnerability framing for remote and subsistence communities.",
    body: `The World Bank assessment notes that communities can be particularly vulnerable where poverty, remoteness, and subsistence agriculture constrain options. This does not mean vulnerability is a fixed trait; it points to the conditions that shape exposure, access, preparedness, and recovery.

Climate action becomes more humane when it strengthens public services and decision-making power rather than asking households to carry systemic risk alone.`,
    topic: "Climate and health",
    region: "Nepal",
    source: sources.health,
    tags: ["equity", "remoteness", "livelihoods", "health systems"],
  }),
  createEntry({
    id: "kb-20",
    title: "Glacial lake outburst flood risk belongs in health planning",
    slug: "nepal-glof-risk-health-planning",
    kind: "documentation",
    summary: "Why glacial lake outburst floods should be considered across disaster risk, water, infrastructure, and health systems.",
    body: `The World Bank’s Nepal climate-health assessment includes glacial lake outburst floods among the hazards relevant to climate-related health risk. A health response therefore cannot be isolated inside clinics: it depends on warning, evacuation, safe water, communications, roads, and continuity of essential services.

The right question is not only how many people are exposed, but whether the system can reach them before, during, and after a shock.`,
    topic: "Climate and health",
    region: "Nepal",
    locality: "High mountain valleys",
    source: sources.health,
    tags: ["GLOF", "health systems", "early warning", "resilience"],
  }),
  createEntry({
    id: "kb-21",
    title: "Nepal’s National Adaptation Plan as a coordination instrument",
    slug: "nepal-national-adaptation-plan-coordination",
    kind: "documentation",
    summary: "The adaptation-planning role of Nepal’s NAP and why coordination matters across levels of government.",
    body: `The Nepal NAP summary frames adaptation priorities and actions as part of the country’s climate-planning architecture. Adaptation becomes real through coordination across national policy, provinces, municipalities, sectors, budgets, and community institutions.

A useful portal entry should help readers distinguish a plan, a funded program, an implemented project, and an observed outcome.`,
    topic: "Adaptation planning",
    region: "Nepal",
    source: sources.nap,
    tags: ["NAP", "adaptation", "governance", "planning"],
  }),
  createEntry({
    id: "kb-22",
    title: "Climate-resilient development is a development question",
    slug: "nepal-climate-resilient-development",
    kind: "research",
    summary: "How Nepal’s Country Climate and Development Report links climate action with growth, inclusion, and resilience.",
    body: `The World Bank’s Nepal Country Climate and Development Report identifies ways for Nepal to pursue development objectives while addressing climate risks. This integrated framing matters because adaptation is not a side project: it affects health, social inclusion, infrastructure, livelihoods, energy, and public finance.

The portal should make these connections legible without presenting a single investment pathway as universally correct.`,
    topic: "Climate and development",
    region: "Nepal",
    source: sources.cddr,
    tags: ["development", "resilience", "inclusion", "public finance"],
  }),
  createEntry({
    id: "kb-23",
    title: "Climate risk profiles are maps for questions, not verdicts",
    slug: "nepal-climate-risk-profile-reading-guide",
    kind: "documentation",
    summary: "A guide to using institutional country risk profiles without overclaiming local certainty.",
    body: `ADB’s Climate Risk Country Profile for Nepal synthesizes climate characteristics, projected change, vulnerability to hazards, and sectoral impacts. Country profiles are useful orientation tools; they should be paired with local data, lived experience, and project-specific assessment before decisions are made.

Good evidence practice keeps the scale and source visible at the moment a claim is presented.`,
    topic: "Risk literacy",
    region: "Nepal",
    source: sources.adb,
    tags: ["ADB", "risk profile", "adaptation", "evidence"],
  }),
  createEntry({
    id: "kb-24",
    title: "Health and climate profiles: turning evidence into action",
    slug: "who-health-climate-profile-practice",
    kind: "knowledge",
    summary: "How WHO country profiles can support climate-health monitoring and national action.",
    body: `WHO’s Health and Climate Change Country Profiles summarize evidence on climate hazards and health risks facing countries. Their practical value is connective: they can help health planners link climate exposure with surveillance, service continuity, prevention, and adaptation.

A humane knowledge experience should always pair risk with a clear action vocabulary and avoid turning population health into a spectacle.`,
    topic: "Climate and health",
    region: "Nepal",
    source: sources.who,
    tags: ["WHO", "health", "monitoring", "adaptation"],
  }),
  createEntry({
    id: "kb-25",
    title: "A field method for reading a watershed",
    slug: "field-method-watershed-reading-nepal",
    kind: "documentation",
    summary: "A practical, source-aligned field method for connecting rainfall, slope, water, settlements, and care.",
    body: `Start with a basin rather than a single hazard. Walk the connections among headwaters, farms, roads, homes, drainage, wetlands, and downstream users; record what is observed, what is reported by residents, and what remains uncertain.

This field method is an editorial method derived from the systems framing in the NDC, ICIMOD assessment, and World Bank risk portal. It is not a claim about a particular site; it describes a way to document named observations, dates, and uncertainty.`,
    topic: "Field methods",
    region: "Nepal",
    source: sources.icimod,
    tags: ["field method", "watershed", "observation", "uncertainty"],
  }),
  createEntry({
    id: "kb-26",
    title: "A humane climate visual starts with a person, not a number",
    slug: "humane-climate-visualization-principles",
    kind: "knowledge",
    summary: "Principles for showing climate change with context, uncertainty, dignity, and a practical response pathway.",
    body: `A climate visual should explain the measure, period, location, source, and uncertainty before asking the audience to feel urgency. It should also show agency: what households, practitioners, institutions, and governments can do, and what requires collective action.

The editorial standard is care without dilution. Do not hide risk; do not turn people living with risk into background scenery.`,
    topic: "Climate communication",
    region: "Nepal",
    source: sources.cckp,
    tags: ["communication", "visualization", "ethics", "agency"],
  }),
  createEntry({
    id: "kb-27",
    title: "Evidence ledger: how to keep the library verifiable",
    slug: "evidence-ledger-knowledge-library",
    kind: "documentation",
    summary: "The provenance fields every Sustainability Lab knowledge entry should carry before publication.",
    body: `Every entry in the library records a source name, source URL, source date, source type, evidence level, topic, region, locality when known, and the difference between an observation, a projection, and an editorial interpretation.

This is not administrative overhead. It is the infrastructure that lets humans and AI agents browse responsibly, cite precisely, and keep a correction trail when better evidence arrives.`,
    topic: "Research practice",
    region: "Nepal",
    source: sources.ndc,
    tags: ["provenance", "citation", "AI governance", "editorial practice"],
  }),
  createEntry({
    id: "kb-28",
    title: "What adaptation can look like when it is locally useful",
    slug: "locally-useful-climate-adaptation-nepal",
    kind: "documentation",
    summary: "A response framework that keeps adaptation practical, equitable, and connected to place.",
    body: `Locally useful adaptation is specific about who decides, who maintains, who pays, who benefits, and how success is observed. Across Nepal’s policy and assessment sources, recurring response spaces include water, health, agriculture, forests, settlements, energy, mobility, and disaster risk.

The most humane intervention is often the one that reduces exposure while expanding people’s room to choose, prepare, and recover.`,
    topic: "Adaptation practice",
    region: "Nepal",
    source: sources.nap,
    tags: ["adaptation", "local governance", "equity", "resilience"],
  }),
];

export function getAllKnowledgeEntries(): KnowledgeEntry[] {
  return knowledgeEntries;
}

/**
 * Query helper to find an entry by its unique slug.
 */
export function getKnowledgeEntryBySlug(slug: string): KnowledgeEntry | undefined {
  return getAllKnowledgeEntries().find((entry) => entry.slug === slug);
}

/**
 * Query helper to retrieve related entries by matching topic or tags.
 */
export function getRelatedKnowledgeEntries(slug: string, limit = 3): KnowledgeEntry[] {
  const all = getAllKnowledgeEntries();
  const current = getKnowledgeEntryBySlug(slug);
  if (!current) return all.slice(0, limit);

  return all
    .filter((entry) => entry.slug !== slug)
    .map((entry) => {
      let score = 0;
      if (entry.topic === current.topic) score += 3;
      if (entry.category === current.category) score += 2;
      const sharedTags = entry.tags.filter((t) => current.tags.includes(t));
      score += sharedTags.length;
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

/**
 * List distinct topics across all active entries.
 */
export function getKnowledgeTopics(): string[] {
  return Array.from(new Set(getAllKnowledgeEntries().map((e) => e.topic))).sort();
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how",
  "i", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most",
  "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
  "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than",
  "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this",
  "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "were", "what",
  "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours",
  // Common conversational / non-domain words
  "world", "first", "last", "give", "make", "take", "like", "tell", "know", "year", "time", "day",
  "state", "many", "much", "good", "new", "well", "code", "write", "play", "game", "recipe", "cook",
  "capital", "city", "people", "person", "need", "help", "want", "look", "think", "come", "went"
]);

/**
 * Search & rank knowledge entries based on relevance to a query.
 * Matches across titles, summaries, tags, topics, source names, and bodies.
 * Automatically incorporates freshly published editorial and WordPress articles.
 */
export function searchKnowledgeEntries(query: string, limit = 4): KnowledgeEntry[] {
  const cleanQ = (query || "").toLowerCase().trim();
  if (!cleanQ) return [];

  const all = getAllKnowledgeEntries();

  // Extract meaningful search tokens
  const tokens = cleanQ
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));

  const scored = all.map((entry) => {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const summaryLower = entry.summary.toLowerCase();
    const bodyLower = entry.body.toLowerCase();
    const topicLower = entry.topic.toLowerCase();
    const categoryLower = entry.category.toLowerCase();
    const sourceLower = entry.source.name.toLowerCase();
    const tagsLower = entry.tags.map((t) => t.toLowerCase());

    // 1. Exact phrase match bonuses
    if (titleLower.includes(cleanQ)) score += 35;
    if (summaryLower.includes(cleanQ)) score += 18;

    // 2. Token matches
    for (const token of tokens) {
      if (titleLower.includes(token)) score += 8;
      if (tagsLower.some((t) => t.includes(token))) score += 6;
      if (topicLower.includes(token) || categoryLower.includes(token)) score += 5;
      if (summaryLower.includes(token)) score += 4;
      if (sourceLower.includes(token)) score += 3;
      if (bodyLower.includes(token)) score += 2;
    }

    // 3. Recency boost for newly published articles
    if (entry.id.startsWith("ed-") || entry.id.startsWith("wp-")) {
      score += 4;
    }

    return { entry, score };
  });

  return scored
    .filter((item) => item.score >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}


