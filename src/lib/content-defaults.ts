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
  application: {
    eyebrow: string;
    title: string;
    summary: string;
    positioning: string;
    highlights: string[];
    fit: { icon: IconName; title: string; desc: string }[];
    preferredRoles: string[];
    preferredIndustries: string[];
    preferredLocations: string[];
    workMode: string;
    availability: string;
    noticePeriod: string;
    salaryExpectation: string;
    ctaLabel: string;
  };
  contact: {
    intro: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    instagram: string;
    website: string;
    footerLine: string;
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    role: "Digital Marketing Executive",
    name: "Yash Pawar",
    tagline:
      "Performance-driven digital marketing specialist with 2.5+ years of experience turning content, creatives, and paid campaigns into qualified leads and measurable brand growth — proven in real estate, ready for any B2C or service industry.",
    ctaPrimary: { label: "View featured project", href: "#project" },
    ctaSecondary: { label: "Contact me", href: "#contact" },
    stats: [
      { k: "2.5+ Yrs", v: "Experience" },
      { k: "Real Estate", v: "Proven Domain" },
      { k: "Palghar, MH", v: "Location" },
    ],
  },
  about: {
    paragraph:
      "I'm a Digital Marketing Executive with 2.5+ years of hands-on experience owning the full digital function for OM Value Homes, a real estate brand in Palghar. I manage content planning, creative design, Meta advertising, lead generation, and reporting — with a focus on qualified enquiries, consistent branding, and data-led optimisation. The frameworks I use (audience research, conversion creative, paid performance, and local SEO) apply across B2C, services, e-commerce, and product businesses.",
    objectiveLabel: "Career Objective",
    objective:
      "To grow into a senior digital marketing role where I can lead multi-channel campaigns across industries, apply data-driven decision making, and combine creativity with AI tools to deliver repeatable, efficient growth.",
    features: [
      { icon: "Target", label: "Lead-focused campaigns" },
      { icon: "Palette", label: "In-house creative design" },
      { icon: "Sparkles", label: "AI-assisted workflows" },
    ],
  },
  experience: [
    {
      role: "Digital Marketing Executive",
      org: "OM Value Homes — Real Estate, Palghar",
      period: "Dec 2024 · Present",
      points: [
        "Manage end-to-end digital marketing across social, paid, and local-search channels.",
        "Plan and execute monthly content calendars and campaign roadmaps tied to business goals.",
        "Run Meta lead-generation campaigns and coordinate lead follow-up with the sales team.",
        "Design social creatives, brochures, and promotional assets for campaigns and launches.",
        "Maintain brand consistency and produce performance reports for continuous improvement.",
      ],
      tools: ["Meta Ads Manager", "Canva", "WordPress", "ChatGPT", "CRM", "Google Sheets", "Google Business Profile"],
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
        category: "Web & Local SEO",
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
    { icon: "Search", title: "Research", desc: "Study the market, audience, competitors, and buyer intent before any campaign begins — so every decision is grounded in evidence, not guesswork." },
    { icon: "CalendarRange", title: "Planning", desc: "Build the content calendar, campaign objectives, budgets, and messaging framework so every channel works toward the same business goal." },
    { icon: "Palette", title: "Creative", desc: "Design posts, reels, ads, and landing-page assets that stay on-brand and conversion-focused, whatever the product or service." },
    { icon: "Rocket", title: "Campaign", desc: "Launch paid and organic campaigns with tested copy, audience targeting, and clear CTAs — from Meta to local SEO and beyond." },
    { icon: "Gauge", title: "Optimization", desc: "Monitor performance, refine targeting and creative, and reduce cost per quality lead or conversion over time." },
    { icon: "FileBarChart", title: "Reporting", desc: "Track results, share transparent reports, and align with stakeholders on next-step decisions that drive growth." },
  ],
  project: [
    { icon: "Building2", title: "Project Overview", body: "OM Value Homes is a real-estate brand where I own the complete digital marketing function — from planning and creatives to campaign execution and reporting. It serves as a live case study of how I apply full-funnel marketing to generate leads and build trust." },
    { icon: "Target", title: "Business Goal", body: "Build consistent brand presence and generate a steady flow of qualified enquiries through paid and organic digital channels." },
    { icon: "Users", title: "Target Audience", body: "Home buyers and investors in and around Palghar and the wider Maharashtra region, segmented by budget, location, and buying intent." },
    { icon: "LineChart", title: "Marketing Strategy", body: "A blend of Meta lead-generation, awareness campaigns, and consistent organic content to keep the brand visible and the pipeline warm." },
    { icon: "PenLine", title: "Content Strategy", body: "Monthly content calendar covering project highlights, location advantages, offers, and trust-building posts across Facebook and Instagram." },
    { icon: "Rocket", title: "Campaign Execution", body: "Set up audiences, wrote ad copy, built creatives, launched lead forms, and coordinated timely follow-up with the sales team." },
    { icon: "Palette", title: "Creatives", body: "Designed feed posts, reels, stories, carousels, brochures, and promotional posters — all kept consistent with the brand identity." },
    { icon: "Search", title: "Challenges", body: "Reaching genuinely interested buyers, keeping cost per lead efficient, and maintaining a steady content output across channels." },
    { icon: "Lightbulb", title: "Solutions", body: "Refined audience targeting, tested multiple creatives and copy angles, and used AI tools to speed up ideation and content production." },
    { icon: "GraduationCap", title: "Learning", body: "Deepened my understanding of the buyer journey, ad optimisation, and how creative quality directly affects lead quality — skills that transfer to any product or service." },
    { icon: "FileBarChart", title: "Campaign Results", body: "Generated 1,200+ qualified leads through Meta lead-form campaigns over 12 months. Maintained an average cost per lead between ₹45–₹90 depending on campaign objective and audience layer, while keeping the sales pipeline active and measurable." },
    { icon: "Gauge", title: "Conversion Metrics", body: "Lead-to-sales-call conversion averaged 8–12%, with qualified enquiries moving to site visits at roughly 4–6%. These numbers were tracked via CRM entries and weekly sales follow-ups." },
    { icon: "TrendingUp", title: "ROI & Reach", body: "Total estimated campaign reach crossed 2.1M with 6.5M+ impressions and 85K+ engagements. Return on ad spend stayed in the 4–6x range for performance campaigns, based on deal-value estimates shared by the sales team." },
    { icon: "BadgeCheck", title: "Key Takeaway", body: "Creative quality and audience targeting matter more than budget size. A disciplined test-and-learn approach — paired with fast CRM handoff — turned paid social into a reliable lead engine for a local real-estate brand." },
    { icon: "Rocket", title: "Future Improvements", body: "Introduce dedicated landing pages, sharper retargeting flows, automated lead nurturing on WhatsApp, and deeper UTM/reporting dashboards to improve lead quality and scale further." },
  ],
  campaigns: [
    { icon: "Facebook", title: "Facebook Ads", desc: "Objective-driven ad sets with tested creatives and copy for awareness, traffic, and enquiries.", tag: "Paid Social" },
    { icon: "Instagram", title: "Instagram Campaign", desc: "Feed, reels, and story campaigns designed to grow reach, brand recall, and engagement.", tag: "Organic + Paid" },
    { icon: "Target", title: "Lead Generation", desc: "Meta lead-form campaigns focused on capturing qualified enquiries at efficient cost per lead.", tag: "Performance" },
    { icon: "Megaphone", title: "Brand Awareness", desc: "Consistent brand messaging to build trust and recognition in the local market and beyond.", tag: "Branding" },
    { icon: "PenLine", title: "Content Marketing", desc: "Value-led content that educates buyers, builds authority, and keeps the brand top of mind.", tag: "Organic" },
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
    "Google Business Profile", "CRM", "WhatsApp Business",
  ],
  ai: [
    { icon: "PenLine", title: "Ad Copy", desc: "Draft and refine multiple ad-copy variations to test tone, angles, and CTAs faster." },
    { icon: "Brain", title: "Brainstorming", desc: "Generate campaign themes, hooks, and content ideas at speed for any industry." },
    { icon: "Search", title: "Research", desc: "Summarise market trends, audience insights, and competitor angles in minutes." },
    { icon: "Lightbulb", title: "Creative Ideas", desc: "Explore reel concepts, captions, and post directions for the monthly calendar." },
    { icon: "Sparkles", title: "Productivity", desc: "Automate repetitive writing so more time goes to strategy, design, and quality." },
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
    { tag: "Learning Roadmap", title: "Deepen performance-marketing expertise", desc: "Advance in audience strategy, funnel building, landing-page optimisation, and data-led decision making across industries." },
    { tag: "Certifications", title: "Pursue recognised marketing certifications", desc: "Meta Blueprint, Google Ads, and Google Analytics certifications to validate and expand core skills." },
    { tag: "Growth Plan", title: "Build a data-driven marketing system", desc: "Move toward measurable, repeatable campaign frameworks that scale results with efficiency in any industry." },
  ],
  application: {
    eyebrow: "Job Application Summary",
    title: "Why I'm a strong fit for Digital Marketing Executive roles",
    summary:
      "Digital Marketing Executive with 2.5+ years of hands-on experience owning the full digital marketing function — paid social, content, creative design, lead generation, CRM handoff, local SEO, and performance reporting. Proven in real estate, and ready to apply the same growth playbook to B2C, D2C, e-commerce, SaaS, ed-tech, healthcare, hospitality, retail, and service brands.",
    positioning:
      "I bring campaign strategy, in-house creative production, and AI-assisted execution together in one role — so teams get faster turnaround, consistent branding, and lead-focused performance without relying on multiple agencies.",
    highlights: [
      "2.5+ years end-to-end digital marketing ownership at OM Value Homes",
      "Meta Ads & lead-form campaigns with sales-team CRM handoff",
      "Monthly content calendars across Instagram, Facebook, and reels",
      "In-house creatives in Canva — posts, ads, reels, stories, brochures, posters",
      "AI-powered workflow using ChatGPT, Claude & Gemini for copy and ideation",
      "Local SEO & Google Business Profile optimisation",
      "WordPress website updates and landing-page support",
      "CRM, WhatsApp Business, and analytics reporting for lead tracking",
    ],
    fit: [
      { icon: "Target", title: "Performance mindset", desc: "Every campaign is tied to leads, reach, or engagement — reviewed against cost and quality, not vanity metrics." },
      { icon: "Palette", title: "Creative + copy in one hand", desc: "I design the visual and write the copy, so campaigns ship faster and stay on-brand." },
      { icon: "Sparkles", title: "AI-native workflow", desc: "Daily use of AI for research, ad-copy variations, hooks, and content ideas — saving hours on execution." },
      { icon: "LineChart", title: "Data-led optimisation", desc: "Comfortable reading Meta Ads reports, CRM data, and Google Sheets to reallocate budget and creative." },
      { icon: "Handshake", title: "Cross-team collaboration", desc: "Worked directly with sales, leadership, and vendors — marketing that connects to revenue." },
      { icon: "GraduationCap", title: "Fast learner", desc: "Quickly maps buyer journey, audience, and channels before spending creative or budget — works across industries." },
    ],
    preferredRoles: [
      "Digital Marketing Executive",
      "Senior Digital Marketing Executive",
      "Performance Marketing Executive",
      "Social Media & Content Executive",
      "PPC / Paid Social Executive",
    ],
    preferredIndustries: [
      "Real Estate",
      "B2C Services",
      "E-commerce",
      "D2C Brands",
      "SaaS / Tech",
      "Ed-Tech",
      "Healthcare",
      "Hospitality",
      "Retail / FMCG",
      "Automotive",
      "Finance / Fintech",
    ],
    preferredLocations: [
      "Mumbai",
      "Thane",
      "Palghar",
      "Vasai–Virar",
      "Navi Mumbai",
      "Remote (India)",
      "Hybrid",
    ],
    workMode: "Full-time · On-site / Hybrid / Remote",
    availability: "Available immediately · Actively interviewing",
    noticePeriod: "Immediate to 15 days",
    salaryExpectation: "As per role & industry standards",
    ctaLabel: "Discuss this role",
  },
  contact: {
    intro: "Open to Digital Marketing Executive and Senior Digital Marketing Executive roles across real estate, B2C, services, and product brands. Let's connect.",
    location: "Palghar (W), Maharashtra",
    email: "theyashpawar92@gmail.com",
    phone: "+91 73850 66631",
    linkedin: "linkedin.com/in/yashpawar9274",
    instagram: "instagram.com/theitsash",
    footerLine: "Digital Marketing · Palghar, Maharashtra",
  },
};

export type ContentKey = keyof SiteContent;
export const CONTENT_KEYS: ContentKey[] = [
  "hero", "about", "experience", "skills", "process", "project",
  "campaigns", "creative", "tools", "ai", "strengths", "goals", "application", "contact",
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
