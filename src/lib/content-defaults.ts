// Default portfolio content. Admin CMS overrides these via the `site_content`
// table. Icons are referenced by string name; the Portfolio component maps
// them to Lucide components via `iconMap`.

export type IconName =
  | "Target" | "PenLine" | "Megaphone" | "LineChart" | "Search"
  | "CalendarRange" | "Palette" | "Rocket" | "Gauge" | "FileBarChart"
  | "Sparkles" | "MessageSquare" | "Building2" | "Users" | "MapPin"
  | "Mail" | "Phone" | "Linkedin" | "Globe" | "QrCode" | "BadgeCheck"
  | "Brain" | "Lightbulb" | "Clock" | "Handshake" | "GraduationCap"
  | "TrendingUp" | "Instagram" | "Facebook" | "FileText" | "Image"
  | "Layers";

export type SiteContent = {
  hero: {
    role: string;
    name: string;
    tagline: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    stats: { k: string; v: string }[];
  };
  about: {
    paragraph: string;
    objectiveLabel: string;
    objective: string;
    features: { icon: IconName; label: string }[];
  };
  experience: {
    role: string;
    org: string;
    period: string;
    points: string[];
    tools: string[];
  }[];
  skills: {
    groups: { category: string; skills: { name: string; level: number }[] }[];
    radar: { area: string; value: number }[];
  };
  process: { icon: IconName; title: string; desc: string }[];
  project: { icon: IconName; title: string; body: string }[];
  campaigns: { icon: IconName; title: string; desc: string; tag: string }[];
  creative: { icon: IconName; label: string }[];
  tools: string[];
  ai: { icon: IconName; title: string; desc: string }[];
  strengths: { icon: IconName; title: string }[];
  goals: { tag: string; title: string; desc: string }[];
  contact: {
    intro: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    instagram: string;
    footerLine: string;
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    role: "Digital Marketing Executive",
    name: "Yash Pawar",
    tagline:
      "Real-estate digital marketing specialist turning content, creatives, and Meta campaigns into consistent, qualified enquiries.",
    ctaPrimary: { label: "View featured project", href: "#project" },
    ctaSecondary: { label: "Contact me", href: "#contact" },
    stats: [
      { k: "1.5 Yrs", v: "Experience" },
      { k: "Real Estate", v: "Industry" },
      { k: "Palghar, MH", v: "Location" },
    ],
  },
  about: {
    paragraph:
      "I'm a Digital Marketing Executive with 1.5+ years of hands-on experience in real-estate marketing. I manage the complete digital function — content planning, creative design, Meta advertising, and reporting — with a focus on generating qualified enquiries and building a consistent, trustworthy brand.",
    objectiveLabel: "Career Objective",
    objective:
      "To grow into a senior digital marketing role where I can lead end-to-end campaigns, apply data-driven decision making, and combine creativity with AI tools to deliver measurable, efficient results.",
    features: [
      { icon: "Target", label: "Lead-focused campaigns" },
      { icon: "Palette", label: "In-house creative design" },
      { icon: "Sparkles", label: "AI-assisted workflows" },
    ],
  },
  experience: [
    {
      role: "Digital Marketing Executive",
      org: "OM Value Homes — Real Estate",
      period: "Dec 2024 · Present",
      points: [
        "Manage end-to-end digital marketing activities across social and paid channels.",
        "Plan and execute the monthly content calendar and campaign roadmap.",
        "Run Meta lead-generation campaigns and coordinate lead follow-up with sales.",
        "Design social creatives, brochures, and promotional assets for launches.",
        "Maintain brand consistency and produce performance reports for review.",
      ],
      tools: ["Meta Ads Manager", "Canva", "WordPress", "ChatGPT", "CRM", "Google Sheets"],
    },
  ],
  skills: {
    groups: [
      {
        category: "Paid Advertising",
        skills: [
          { name: "Meta Ads", level: 90 },
          { name: "Facebook Ads", level: 90 },
          { name: "Lead Generation", level: 88 },
          { name: "Instagram Marketing", level: 85 },
        ],
      },
      {
        category: "Content & Creative",
        skills: [
          { name: "Content Planning", level: 88 },
          { name: "Copywriting", level: 85 },
          { name: "Social Media Strategy", level: 85 },
          { name: "Canva Design", level: 82 },
        ],
      },
      {
        category: "AI & Tools",
        skills: [
          { name: "ChatGPT / Claude / Gemini", level: 88 },
          { name: "Marketing Automation (Basic)", level: 70 },
          { name: "CRM Management", level: 78 },
          { name: "WhatsApp Marketing", level: 82 },
        ],
      },
      {
        category: "Web & Analytics",
        skills: [
          { name: "Basic SEO", level: 72 },
          { name: "Google Business Profile", level: 80 },
          { name: "WordPress", level: 70 },
          { name: "Analytics & Reporting", level: 78 },
        ],
      },
    ],
    radar: [
      { area: "Paid Ads", value: 90 },
      { area: "Content", value: 86 },
      { area: "Creative", value: 82 },
      { area: "AI Tools", value: 88 },
      { area: "Lead Gen", value: 88 },
      { area: "Analytics", value: 76 },
    ],
  },
  process: [
    { icon: "Search", title: "Research", desc: "Study the market, audience, competitors, and local buyer intent before any campaign begins." },
    { icon: "CalendarRange", title: "Planning", desc: "Build the monthly content calendar, campaign objectives, budgets, and messaging framework." },
    { icon: "Palette", title: "Creative", desc: "Design posts, reels, brochures, and ad creatives that stay on-brand and conversion-focused." },
    { icon: "Rocket", title: "Campaign", desc: "Launch Meta lead-gen and awareness campaigns with tested copy and audience targeting." },
    { icon: "Gauge", title: "Optimization", desc: "Monitor performance, refine targeting and creatives, and reduce cost per quality lead." },
    { icon: "FileBarChart", title: "Reporting", desc: "Track results, share transparent performance reports, and align on next-step decisions." },
  ],
  project: [
    { icon: "Building2", title: "Project Overview", body: "OM Value Homes is a real-estate brand where I own the complete digital marketing function — from planning to creatives to campaign execution and reporting." },
    { icon: "Target", title: "Business Goal", body: "Build consistent brand presence and generate a steady flow of qualified property enquiries through paid and organic digital channels." },
    { icon: "Users", title: "Target Audience", body: "Home buyers and investors in and around Palghar and the wider Maharashtra region, segmented by budget, location, and buying intent." },
    { icon: "LineChart", title: "Marketing Strategy", body: "A blend of Meta lead-generation, awareness campaigns, and consistent organic content to keep the brand visible and the pipeline warm." },
    { icon: "PenLine", title: "Content Strategy", body: "Monthly content calendar covering project highlights, location advantages, offers, and trust-building posts across Facebook and Instagram." },
    { icon: "Rocket", title: "Campaign Execution", body: "Set up audiences, wrote ad copy, built creatives, launched lead forms, and coordinated timely follow-up with the sales team." },
    { icon: "Palette", title: "Creatives", body: "Designed feed posts, reels, stories, carousels, brochures, and promotional posters — all kept consistent with the brand identity." },
    { icon: "Search", title: "Challenges", body: "Reaching genuinely interested buyers, keeping cost per lead efficient, and maintaining a steady content output across channels." },
    { icon: "Lightbulb", title: "Solutions", body: "Refined audience targeting, tested multiple creatives and copy angles, and used AI tools to speed up ideation and content production." },
    { icon: "GraduationCap", title: "Learning", body: "Deepened my understanding of the real-estate buyer journey, ad optimisation, and how creative quality directly affects lead quality." },
    { icon: "TrendingUp", title: "Future Improvements", body: "Introduce structured landing pages, sharper retargeting flows, and more data-driven reporting to further improve lead quality." },
    { icon: "BadgeCheck", title: "Results", body: "Add Campaign Results Here — leads generated, cost per lead, reach, and engagement to be added once verified figures are shared." },
  ],
  campaigns: [
    { icon: "Facebook", title: "Facebook Ads", desc: "Objective-driven ad sets with tested creatives and copy for awareness and enquiries.", tag: "Paid Social" },
    { icon: "Instagram", title: "Instagram Campaign", desc: "Feed, reels, and story campaigns designed to grow reach and brand recall.", tag: "Organic + Paid" },
    { icon: "Target", title: "Lead Generation", desc: "Meta lead-form campaigns focused on capturing qualified property enquiries.", tag: "Performance" },
    { icon: "Megaphone", title: "Brand Awareness", desc: "Consistent brand messaging to build trust and recognition in the local market.", tag: "Branding" },
    { icon: "PenLine", title: "Content Marketing", desc: "Value-led content that educates buyers and keeps the brand top of mind.", tag: "Organic" },
  ],
  creative: [
    { icon: "Instagram", label: "Instagram Posts" },
    { icon: "Facebook", label: "Facebook Ads" },
    { icon: "FileText", label: "Brochures" },
    { icon: "Image", label: "Reels" },
    { icon: "Layers", label: "Stories" },
    { icon: "Layers", label: "Carousels" },
    { icon: "Image", label: "Posters" },
    { icon: "Palette", label: "Branding" },
  ],
  tools: [
    "Meta Business Suite", "Ads Manager", "Canva", "ChatGPT", "Claude", "Gemini",
    "Google Drive", "Google Docs", "Google Sheets", "Excel", "WordPress", "Notion",
  ],
  ai: [
    { icon: "PenLine", title: "Ad Copy", desc: "Draft and refine multiple ad-copy variations to test tone and angles faster." },
    { icon: "Brain", title: "Brainstorming", desc: "Generate campaign themes, hooks, and content ideas at speed." },
    { icon: "Search", title: "Research", desc: "Summarise market trends, audience insights, and competitor angles." },
    { icon: "Lightbulb", title: "Creative Ideas", desc: "Explore reel concepts, captions, and post directions for the calendar." },
    { icon: "Sparkles", title: "Productivity", desc: "Automate repetitive writing so more time goes to strategy and quality." },
  ],
  strengths: [
    { icon: "MessageSquare", title: "Communication" },
    { icon: "Lightbulb", title: "Problem Solving" },
    { icon: "Palette", title: "Creativity" },
    { icon: "Target", title: "Campaign Planning" },
    { icon: "Handshake", title: "Teamwork" },
    { icon: "GraduationCap", title: "Learning Ability" },
    { icon: "Clock", title: "Time Management" },
  ],
  goals: [
    { tag: "Career Roadmap", title: "Grow into a Senior Digital Marketing role", desc: "Take ownership of larger campaigns, budgets, and cross-channel strategy while mentoring newer team members." },
    { tag: "Learning Roadmap", title: "Deepen performance-marketing expertise", desc: "Advance in audience strategy, funnel building, landing-page optimisation, and data-led decision making." },
    { tag: "Certifications", title: "Pursue recognised marketing certifications", desc: "Meta Blueprint, Google Ads, and Google Analytics certifications to validate and expand core skills." },
    { tag: "Growth Plan", title: "Build a data-driven marketing system", desc: "Move toward measurable, repeatable campaign frameworks that scale results with efficiency." },
  ],
  contact: {
    intro: "Open to Digital Marketing Executive and Senior Digital Marketing Executive roles. Let's connect.",
    location: "Palghar (W), Maharashtra",
    email: "theyashpawar92@gmail.com",
    phone: "+91 73850 66631",
    linkedin: "linkedin.com/in/yashpawar9274",
    instagram: "instagram.com/theitsash",
    footerLine: "Real Estate Digital Marketing · Palghar, Maharashtra",
  },
};

export type ContentKey = keyof SiteContent;
export const CONTENT_KEYS: ContentKey[] = [
  "hero", "about", "experience", "skills", "process", "project",
  "campaigns", "creative", "tools", "ai", "strengths", "goals", "contact",
];

export function mergeContent(overrides: Partial<Record<string, unknown>> | null | undefined): SiteContent {
  const out = { ...DEFAULT_CONTENT } as SiteContent;
  if (!overrides) return out;
  for (const k of CONTENT_KEYS) {
    const v = overrides[k];
    if (v !== undefined && v !== null) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}
