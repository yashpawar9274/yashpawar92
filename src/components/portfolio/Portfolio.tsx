import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  Target,
  PenLine,
  Megaphone,
  LineChart,
  Search,
  CalendarRange,
  Palette,
  Rocket,
  Gauge,
  FileBarChart,
  Sparkles,
  MessageSquare,
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
  QrCode,
  BadgeCheck,
  Brain,
  Lightbulb,
  Clock,
  Handshake,
  GraduationCap,
  TrendingUp,
  Instagram,
  Facebook,
  FileText,
  Image as ImageIcon,
  Layers,
  Send,
  CheckCircle2,
} from "lucide-react";

import portrait from "@/assets/portrait.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { Navbar } from "./Navbar";
import { Reveal, StaggerGroup, staggerChild } from "./reveal";

/* ---------------------------------- Shell --------------------------------- */

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 py-24 lg:px-10 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  intro,
  index,
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  index: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mb-14 max-w-3xl lg:mb-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <span
          className={`text-xs font-semibold tracking-widest ${
            dark ? "text-white/30" : "text-muted-foreground/50"
          }`}
        >
          / {index}
        </span>
      </div>
      <h2
        className={`text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed lg:text-lg ${
            dark ? "text-white/60" : "text-muted-foreground"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/* ----------------------------------- Data --------------------------------- */

const skillGroups = [
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
];

const radarData = [
  { area: "Paid Ads", value: 90 },
  { area: "Content", value: 86 },
  { area: "Creative", value: 82 },
  { area: "AI Tools", value: 88 },
  { area: "Lead Gen", value: 88 },
  { area: "Analytics", value: 76 },
];

const experience = [
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
];

const process = [
  {
    icon: Search,
    title: "Research",
    desc: "Study the market, audience, competitors, and local buyer intent before any campaign begins.",
  },
  {
    icon: CalendarRange,
    title: "Planning",
    desc: "Build the monthly content calendar, campaign objectives, budgets, and messaging framework.",
  },
  {
    icon: Palette,
    title: "Creative",
    desc: "Design posts, reels, brochures, and ad creatives that stay on-brand and conversion-focused.",
  },
  {
    icon: Rocket,
    title: "Campaign",
    desc: "Launch Meta lead-gen and awareness campaigns with tested copy and audience targeting.",
  },
  {
    icon: Gauge,
    title: "Optimization",
    desc: "Monitor performance, refine targeting and creatives, and reduce cost per quality lead.",
  },
  {
    icon: FileBarChart,
    title: "Reporting",
    desc: "Track results, share transparent performance reports, and align on next-step decisions.",
  },
];

const projectBlocks = [
  {
    icon: Building2,
    title: "Project Overview",
    body: "OM Value Homes is a real-estate brand where I own the complete digital marketing function — from planning to creatives to campaign execution and reporting.",
  },
  {
    icon: Target,
    title: "Business Goal",
    body: "Build consistent brand presence and generate a steady flow of qualified property enquiries through paid and organic digital channels.",
  },
  {
    icon: Users,
    title: "Target Audience",
    body: "Home buyers and investors in and around Palghar and the wider Maharashtra region, segmented by budget, location, and buying intent.",
  },
  {
    icon: LineChart,
    title: "Marketing Strategy",
    body: "A blend of Meta lead-generation, awareness campaigns, and consistent organic content to keep the brand visible and the pipeline warm.",
  },
  {
    icon: PenLine,
    title: "Content Strategy",
    body: "Monthly content calendar covering project highlights, location advantages, offers, and trust-building posts across Facebook and Instagram.",
  },
  {
    icon: Rocket,
    title: "Campaign Execution",
    body: "Set up audiences, wrote ad copy, built creatives, launched lead forms, and coordinated timely follow-up with the sales team.",
  },
];

const projectExtra = [
  {
    icon: Palette,
    title: "Creatives",
    body: "Designed feed posts, reels, stories, carousels, brochures, and promotional posters — all kept consistent with the brand identity.",
  },
  {
    icon: Search,
    title: "Challenges",
    body: "Reaching genuinely interested buyers, keeping cost per lead efficient, and maintaining a steady content output across channels.",
  },
  {
    icon: Lightbulb,
    title: "Solutions",
    body: "Refined audience targeting, tested multiple creatives and copy angles, and used AI tools to speed up ideation and content production.",
  },
  {
    icon: GraduationCap,
    title: "Learning",
    body: "Deepened my understanding of the real-estate buyer journey, ad optimisation, and how creative quality directly affects lead quality.",
  },
  {
    icon: TrendingUp,
    title: "Future Improvements",
    body: "Introduce structured landing pages, sharper retargeting flows, and more data-driven reporting to further improve lead quality.",
  },
  {
    icon: BadgeCheck,
    title: "Results",
    body: "Add Campaign Results Here — leads generated, cost per lead, reach, and engagement to be added once verified figures are shared.",
  },
];

const campaigns = [
  {
    icon: Facebook,
    title: "Facebook Ads",
    desc: "Objective-driven ad sets with tested creatives and copy for awareness and enquiries.",
    tag: "Paid Social",
  },
  {
    icon: Instagram,
    title: "Instagram Campaign",
    desc: "Feed, reels, and story campaigns designed to grow reach and brand recall.",
    tag: "Organic + Paid",
  },
  {
    icon: Target,
    title: "Lead Generation",
    desc: "Meta lead-form campaigns focused on capturing qualified property enquiries.",
    tag: "Performance",
  },
  {
    icon: Megaphone,
    title: "Brand Awareness",
    desc: "Consistent brand messaging to build trust and recognition in the local market.",
    tag: "Branding",
  },
  {
    icon: PenLine,
    title: "Content Marketing",
    desc: "Value-led content that educates buyers and keeps the brand top of mind.",
    tag: "Organic",
  },
];

const creativeItems = [
  { icon: Instagram, label: "Instagram Posts" },
  { icon: Facebook, label: "Facebook Ads" },
  { icon: FileText, label: "Brochures" },
  { icon: ImageIcon, label: "Reels" },
  { icon: Layers, label: "Stories" },
  { icon: Layers, label: "Carousels" },
  { icon: ImageIcon, label: "Posters" },
  { icon: Palette, label: "Branding" },
];

const tools = [
  "Meta Business Suite",
  "Ads Manager",
  "Canva",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Google Drive",
  "Google Docs",
  "Google Sheets",
  "Excel",
  "WordPress",
  "Notion",
];

const aiWorkflow = [
  { icon: PenLine, title: "Ad Copy", desc: "Draft and refine multiple ad-copy variations to test tone and angles faster." },
  { icon: Brain, title: "Brainstorming", desc: "Generate campaign themes, hooks, and content ideas at speed." },
  { icon: Search, title: "Research", desc: "Summarise market trends, audience insights, and competitor angles." },
  { icon: Lightbulb, title: "Creative Ideas", desc: "Explore reel concepts, captions, and post directions for the calendar." },
  { icon: Sparkles, title: "Productivity", desc: "Automate repetitive writing so more time goes to strategy and quality." },
];

const strengths = [
  { icon: MessageSquare, title: "Communication" },
  { icon: Lightbulb, title: "Problem Solving" },
  { icon: Palette, title: "Creativity" },
  { icon: Target, title: "Campaign Planning" },
  { icon: Handshake, title: "Teamwork" },
  { icon: GraduationCap, title: "Learning Ability" },
  { icon: Clock, title: "Time Management" },
];

const goals = [
  {
    tag: "Career Roadmap",
    title: "Grow into a Senior Digital Marketing role",
    desc: "Take ownership of larger campaigns, budgets, and cross-channel strategy while mentoring newer team members.",
  },
  {
    tag: "Learning Roadmap",
    title: "Deepen performance-marketing expertise",
    desc: "Advance in audience strategy, funnel building, landing-page optimisation, and data-led decision making.",
  },
  {
    tag: "Certifications",
    title: "Pursue recognised marketing certifications",
    desc: "Meta Blueprint, Google Ads, and Google Analytics certifications to validate and expand core skills.",
  },
  {
    tag: "Growth Plan",
    title: "Build a data-driven marketing system",
    desc: "Move toward measurable, repeatable campaign frameworks that scale results with efficiency.",
  },
];

/* ---------------------------------- Page ---------------------------------- */

export function Portfolio() {
  return (
    <div id="top" className="overflow-x-hidden bg-background">
      <Navbar />

      {/* 1 — COVER */}
      <header className="relative flex min-h-screen items-center overflow-hidden bg-ink text-white">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-28 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-32">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="eyebrow !text-blue-glow"
            >
              <span className="h-px w-8 bg-blue-glow" /> Digital Marketing Executive
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Yash Pawar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:text-xl"
            >
              Real-estate digital marketing specialist turning content, creatives, and
              Meta campaigns into consistent, qualified enquiries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#project"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                View featured project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact me
              </a>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.36 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
            >
              {[
                { k: "1.5 Yrs", v: "Experience" },
                { k: "Real Estate", v: "Industry" },
                { k: "Palghar, MH", v: "Location" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-xl font-bold text-white lg:text-2xl">
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-white/50">
                    {s.v}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-blue/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 shadow-[var(--shadow-blue)]">
              <img
                src={portrait}
                alt="Yash Pawar — professional photo placeholder"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/15 bg-ink/60 px-4 py-3 backdrop-blur-md">
                <span className="text-sm font-semibold">Yash Pawar</span>
                <span className="text-xs text-blue-glow">Add your photo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2 — ABOUT */}
      <Section id="about">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeader
            index="01"
            eyebrow="About Me"
            title={
              <>
                A marketer who pairs <span className="text-gradient-blue">creative craft</span>{" "}
                with performance discipline.
              </>
            }
          />
          <div className="space-y-8">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-foreground">
                I'm a Digital Marketing Executive with 1.5+ years of hands-on experience in
                real-estate marketing. I manage the complete digital function — content
                planning, creative design, Meta advertising, and reporting — with a focus on
                generating qualified enquiries and building a consistent, trustworthy brand.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="rounded-2xl border border-border bg-secondary/50 p-6 lg:p-8">
                <span className="eyebrow">Career Objective</span>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  To grow into a senior digital marketing role where I can lead end-to-end
                  campaigns, apply data-driven decision making, and combine creativity with AI
                  tools to deliver measurable, efficient results.
                </p>
              </div>
            </Reveal>
            <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Target, label: "Lead-focused campaigns" },
                { icon: Palette, label: "In-house creative design" },
                { icon: Sparkles, label: "AI-assisted workflows" },
              ].map((f) => (
                <motion.div
                  key={f.label}
                  variants={staggerChild}
                  className="card-premium flex items-start gap-3 p-5"
                >
                  <f.icon className="h-5 w-5 shrink-0 text-blue" />
                  <span className="text-sm font-medium">{f.label}</span>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Section>

      {/* 3 — EXPERIENCE */}
      <Section id="experience" className="bg-secondary/40">
        <SectionHeader
          index="02"
          eyebrow="Experience"
          title="Experience Timeline"
          intro="A focused, ownership-driven role covering the full digital marketing lifecycle."
        />
        <div className="relative border-l border-border pl-8 lg:pl-12">
          {experience.map((e, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="relative pb-4">
                <span className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink lg:-left-[57px]">
                  <span className="h-2 w-2 rounded-full bg-blue-glow" />
                </span>
                <div className="card-premium p-7 lg:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold lg:text-2xl">{e.role}</h3>
                      <p className="mt-1 text-sm font-medium text-blue">{e.org}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-muted-foreground">
                      {e.period}
                    </span>
                  </div>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {e.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                    {e.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 4 — SKILLS */}
      <Section id="skills">
        <SectionHeader
          index="03"
          eyebrow="Core Skills"
          title="Core Skills & Capabilities"
          intro="A balanced skill set across paid advertising, content, creative, AI tools, and analytics."
        />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <StaggerGroup className="grid gap-5 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <motion.div
                key={g.category}
                variants={staggerChild}
                className="card-premium card-premium-hover p-6"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue">
                  {g.category}
                </h3>
                <div className="mt-5 space-y-4">
                  {g.skills.map((s) => (
                    <div key={s.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "var(--gradient-blue)" }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </StaggerGroup>

          <Reveal delay={0.15} className="card-premium flex flex-col p-6 lg:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue">
              Skill Focus Areas
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A snapshot of where my strengths concentrate across the marketing stack.
            </p>
            <div className="mt-2 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="var(--color-blue)"
                    fill="var(--color-blue)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 5 — PROCESS */}
      <Section id="process" className="relative overflow-hidden bg-ink text-white">
        <SectionHeader
          index="04"
          eyebrow="How I Work"
          dark
          title="The Digital Marketing Process"
          intro="A repeatable, six-stage approach that keeps every campaign structured from insight to impact."
        />
        <StaggerGroup className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {process.map((p, i) => (
            <motion.div
              key={p.title}
              variants={staggerChild}
              className="group relative bg-ink p-8 transition-colors hover:bg-white/[0.04]"
            >
              <span className="text-xs font-bold tracking-widest text-white/25">
                0{i + 1}
              </span>
              <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-blue-glow">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{p.desc}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 6 — FEATURED PROJECT */}
      <Section id="project">
        <SectionHeader
          index="05"
          eyebrow="Featured Project"
          title={
            <>
              Case Study: <span className="text-gradient-blue">OM Value Homes</span>
            </>
          }
          intro="End-to-end ownership of digital marketing for a real-estate brand — from strategy and creatives to campaigns and reporting."
        />
        <StaggerGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...projectBlocks, ...projectExtra].map((b) => (
            <motion.div
              key={b.title}
              variants={staggerChild}
              className={`card-premium card-premium-hover p-7 ${
                b.title === "Results" ? "border-dashed border-blue/40 bg-blue/[0.03]" : ""
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-blue">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 7 — CAMPAIGN SHOWCASE */}
      <Section id="campaigns" className="bg-secondary/40">
        <SectionHeader
          index="06"
          eyebrow="Campaign Showcase"
          title="Campaign Types I Deliver"
          intro="The core campaign formats I plan, build, and manage across paid and organic channels."
        />
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <motion.div
              key={c.title}
              variants={staggerChild}
              className="card-premium card-premium-hover group flex flex-col p-7"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {c.tag}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
          <motion.div
            variants={staggerChild}
            className="flex flex-col justify-center rounded-2xl border border-dashed border-blue/40 bg-blue/[0.03] p-7"
          >
            <span className="eyebrow">Results</span>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Add Campaign Results Here — reach, leads, and engagement metrics can be added
              once verified figures are available.
            </p>
          </motion.div>
        </StaggerGroup>
      </Section>

      {/* 8 — CREATIVE PORTFOLIO */}
      <Section id="creative">
        <SectionHeader
          index="07"
          eyebrow="Creative Portfolio"
          title="Creative Formats & Design Work"
          intro="A range of on-brand creative assets designed in-house for social and promotional use."
        />
        <StaggerGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {creativeItems.map((c) => (
            <motion.div
              key={c.label}
              variants={staggerChild}
              className="card-premium card-premium-hover group flex aspect-[4/3] flex-col justify-between overflow-hidden p-6"
            >
              <c.icon className="h-6 w-6 text-blue transition-transform group-hover:scale-110" />
              <div>
                <h3 className="text-sm font-bold">{c.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Add samples here</p>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 9 — TOOLS */}
      <Section id="tools" className="bg-secondary/40">
        <SectionHeader
          index="08"
          eyebrow="Marketing Tools"
          title="Tools & Platforms"
          intro="The day-to-day stack I use to plan, create, launch, and report on campaigns."
        />
        <StaggerGroup className="flex flex-wrap gap-3">
          {tools.map((t) => (
            <motion.span
              key={t}
              variants={staggerChild}
              className="card-premium card-premium-hover flex items-center gap-2 px-5 py-3 text-sm font-semibold"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              {t}
            </motion.span>
          ))}
        </StaggerGroup>
      </Section>

      {/* 10 — AI WORKFLOW */}
      <Section id="ai">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeader
              index="09"
              eyebrow="AI Workflow"
              title={
                <>
                  AI as a <span className="text-gradient-blue">creative co-pilot</span>
                </>
              }
              intro="I use ChatGPT, Claude, and Gemini to work faster and think broader — while keeping human judgment on strategy and brand quality."
            />
            <Reveal delay={0.1}>
              <div className="card-premium flex items-center gap-4 p-6">
                <Sparkles className="h-6 w-6 shrink-0 text-blue" />
                <p className="text-sm text-muted-foreground">
                  AI accelerates ideation and drafting; the strategy, brand voice, and final
                  decisions stay human-led.
                </p>
              </div>
            </Reveal>
          </div>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {aiWorkflow.map((a) => (
              <motion.div
                key={a.title}
                variants={staggerChild}
                className="card-premium card-premium-hover p-6"
              >
                <a.icon className="h-5 w-5 text-blue" />
                <h3 className="mt-4 text-base font-bold">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* 11 — STRENGTHS */}
      <Section id="strengths" className="bg-secondary/40">
        <SectionHeader
          index="10"
          eyebrow="Professional Strengths"
          title="What I Bring to a Team"
          intro="The professional qualities that keep campaigns organised and collaboration smooth."
        />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((s) => (
            <motion.div
              key={s.title}
              variants={staggerChild}
              className="card-premium card-premium-hover flex items-center gap-4 p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold">{s.title}</span>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 12 — FUTURE GOALS */}
      <Section id="goals">
        <SectionHeader
          index="11"
          eyebrow="Future Goals"
          title="Career & Growth Roadmap"
          intro="A clear direction for growth — deeper expertise, recognised certifications, and senior-level impact."
        />
        <div className="relative">
          <StaggerGroup className="grid gap-5 md:grid-cols-2">
            {goals.map((g, i) => (
              <motion.div
                key={g.title}
                variants={staggerChild}
                className="card-premium card-premium-hover p-7 lg:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-xs font-bold text-blue">
                    0{i + 1}
                  </span>
                  <span className="eyebrow">{g.tag}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* 13 — CONTACT */}
      <Section id="contact" className="relative overflow-hidden bg-ink text-white">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeader
              index="12"
              eyebrow="Contact"
              dark
              title={
                <>
                  Let's build campaigns that{" "}
                  <span className="text-gradient-blue">convert.</span>
                </>
              }
              intro="Open to Digital Marketing Executive and Senior Digital Marketing Executive roles. Let's connect."
            />
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-blue-glow" />
              Palghar (W), Maharashtra
            </div>
          </div>

          <div className="grid gap-4">
            <StaggerGroup className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Mail, label: "Email", value: "theyashpawar92@gmail.com" },
                { icon: Phone, label: "Phone", value: "+91 73850 66631" },
                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/yashpawar9274" },
                { icon: Instagram, label: "Instagram", value: "instagram.com/theitsash" },
              ].map((c) => (
                <motion.div
                  key={c.label}
                  variants={staggerChild}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]"
                >
                  <c.icon className="h-5 w-5 text-blue-glow" />
                  <p className="mt-4 text-xs uppercase tracking-wider text-white/40">
                    {c.label}
                  </p>
                  <p className="mt-1 text-sm font-medium break-words text-white/90">
                    {c.value}
                  </p>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </div>

        <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Yash Pawar — Digital Marketing Executive
          </span>
          <span>Real Estate Digital Marketing · Palghar, Maharashtra</span>
        </div>
      </Section>
    </div>
  );
}
