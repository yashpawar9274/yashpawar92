import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listOmvhUploads } from "@/lib/omvh.functions";
import { getSiteContent } from "@/lib/content.functions";
import { mergeContent, type IconName, type SiteContent } from "@/lib/content-defaults";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight, Target, PenLine, Megaphone, LineChart, Search,
  CalendarRange, Palette, Rocket, Gauge, FileBarChart, Sparkles,
  MessageSquare, Building2, Users, MapPin, Mail, Phone, Linkedin,
  Globe, QrCode, BadgeCheck, Brain, Lightbulb, Clock, Handshake,
  GraduationCap, TrendingUp, Instagram, Facebook, FileText,
  Image as ImageIcon, Layers, Send, CheckCircle2,
  type LucideIcon,
} from "lucide-react";

import portrait from "@/assets/portrait.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { Navbar } from "./Navbar";
import { Reveal, StaggerGroup, staggerChild } from "./reveal";
import { EditableImage } from "./EditableImage";

import dreamAsset from "@/assets/omvh/dream.asset.json";
import newspaperAsset from "@/assets/omvh/newspaper.asset.json";
import rentAsset from "@/assets/omvh/rent.asset.json";
import beforeAfterAsset from "@/assets/omvh/beforeafter.asset.json";
import comfortAsset from "@/assets/omvh/comfort.asset.json";
import linesAsset from "@/assets/omvh/lines.asset.json";
import gmbAsset from "@/assets/omvh/gmb.asset.json";

const ASSET_HOST = "https://project--2b272c81-12e2-4f7d-954c-9b45799b6698.lovable.app";
const abs = (u: string) => (u.startsWith("http") ? u : `${ASSET_HOST}${u}`);

const IMAGES = {
  dream: abs(dreamAsset.url),
  newspaper: abs(newspaperAsset.url),
  rent: abs(rentAsset.url),
  beforeAfter: abs(beforeAfterAsset.url),
  comfort: abs(comfortAsset.url),
  lines: abs(linesAsset.url),
  gmb: abs(gmbAsset.url),
};

const omvhCreatives: { src: string; title: string; tag: string; desc: string; alt: string; aspect: string }[] = [
  { src: IMAGES.dream, title: "Your Dream Home — 1 BHK Launch", tag: "Property Launch Creative", desc: "Lead-form campaign creative for the OM Value Homes 1 BHK launch — interior photography, pricing, amenities, and RERA compliance combined into a single conversion-focused visual.", alt: "OM Value Homes 1 BHK launch creative titled 'Your Dream Home' showing modern interior photography, unit pricing, and key amenities for Meta lead-form ads.", aspect: "1 / 1" },
  { src: IMAGES.newspaper, title: "Times-of-India Style Print Concept", tag: "Print · Social Concept", desc: "Newspaper-style concept creative distributed on Meta to borrow the credibility of a familiar editorial format — used to warm up cold audiences before retargeting.", alt: "Newspaper-style OM Value Homes ad held by a smiling delivery courier on a bicycle, designed as a social credibility concept for Meta campaigns.", aspect: "4 / 5" },
  { src: IMAGES.rent, title: "Stop Paying Rent — Rent vs. Own", tag: "Awareness Campaign", desc: "Long-form awareness creative built around the buyer psychology of renting versus building an asset — designed for save-and-share behaviour on Instagram.", alt: "'Stop Paying Rent' awareness creative for OM Value Homes comparing monthly rent outflow versus home-ownership EMIs in a side-by-side layout.", aspect: "16 / 10" },
  { src: IMAGES.comfort, title: "Designed for Comfort — Lifestyle Visual", tag: "Lifestyle Creative", desc: "Lifestyle-led creative featuring real living, kitchen, and bedroom photography with clear pricing and USPs — used in the mid-funnel to build aspiration.", alt: "'Designed for Comfort' OM Value Homes lifestyle creative featuring a modern living room, clean typography, and pricing overlay.", aspect: "1 / 1" },
  { src: IMAGES.beforeAfter, title: "Before / After — Space to Home", tag: "Storytelling Post", desc: "Transformation creative — bare shell vs. fully furnished living room — used to communicate finish quality and possession readiness to serious buyers.", alt: "OM Value Homes before-and-after creative showing an empty apartment shell on the left and the same space fully furnished as a living room on the right.", aspect: "16 / 10" },
  { src: IMAGES.lines, title: "From Lines on Paper to a Life Well Built", tag: "Brand Story", desc: "Sketch-to-reality brand creative connecting architectural design intent with the finished project on the ground — the anchor visual for brand-story campaigns.", alt: "OM Value Homes brand creative titled 'From lines on paper to a life well built' showing an architectural pencil sketch transitioning into a photograph of the finished building.", aspect: "4 / 5" },
  { src: IMAGES.gmb, title: "Google Business Profile — Local SEO", tag: "Local SEO · Reviews", desc: "Google Business Profile creative reinforcing the 5.0 rating, project location, photos, and direct call CTA — the last-click asset for local Palghar buyers searching by intent.", alt: "Mockup of the OM Value Homes Google Business Profile displaying a 5.0-star rating, project photos, address, and a call button — highlighting local SEO work.", aspect: "4 / 5" },
];

/* ------------------------------ icon map --------------------------------- */
export const ICONS: Record<IconName, LucideIcon> = {
  Target, PenLine, Megaphone, LineChart, Search, CalendarRange, Palette, Rocket,
  Gauge, FileBarChart, Sparkles, MessageSquare, Building2, Users, MapPin, Mail,
  Phone, Linkedin, Globe, QrCode, BadgeCheck, Brain, Lightbulb, Clock, Handshake,
  GraduationCap, TrendingUp, Instagram, Facebook, FileText, Image: ImageIcon, Layers,
};
const Ico = ({ name, className }: { name: IconName | string; className?: string }) => {
  const C = ICONS[name as IconName] ?? Sparkles;
  return <C className={className} />;
};

/* ---------------------------- layout helpers ------------------------------ */
function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-6 py-24 lg:px-10 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function SectionHeader({
  eyebrow, title, intro, index, dark = false,
}: { eyebrow: string; title: ReactNode; intro?: string; index: string; dark?: boolean }) {
  return (
    <Reveal className="mb-14 max-w-3xl lg:mb-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <span className={`text-xs font-semibold tracking-widest ${dark ? "text-white/30" : "text-muted-foreground/50"}`}>/ {index}</span>
      </div>
      <h2 className={`text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-foreground"}`}>{title}</h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed lg:text-lg ${dark ? "text-white/60" : "text-muted-foreground"}`}>{intro}</p>
      )}
    </Reveal>
  );
}

/* --------------------------------- Page ---------------------------------- */
export function Portfolio() {
  const fetchUploads = useServerFn(listOmvhUploads);
  const fetchContent = useServerFn(getSiteContent);
  const { data: uploads = [] } = useQuery({ queryKey: ["omvh-uploads"], queryFn: () => fetchUploads(), staleTime: 60_000 });
  const { data: raw } = useQuery({ queryKey: ["site-content"], queryFn: () => fetchContent(), staleTime: 60_000 });
  const c: SiteContent = mergeContent(raw);

  return (
    <div id="top" className="overflow-x-hidden bg-background">
      <Navbar />

      {/* 1 — COVER */}
      <header className="relative flex min-h-screen items-center overflow-hidden bg-ink text-white">
        <img src={heroBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-28 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-32">
          <div>
            <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="eyebrow !text-blue-glow">
              <span className="h-px w-8 bg-blue-glow" /> {c.hero.role}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="mt-6 text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              {c.hero.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }} className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:text-xl">
              {c.hero.tagline}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex flex-wrap gap-3">
              <a href={c.hero.ctaPrimary.href} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]">
                {c.hero.ctaPrimary.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href={c.hero.ctaSecondary.href} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                {c.hero.ctaSecondary.label}
              </a>
            </motion.div>
            <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.36 }} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {c.hero.stats.map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-xl font-bold text-white lg:text-2xl">{s.k}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-white/50">{s.v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 shadow-[var(--shadow-blue)]">
              <EditableImage storageKey="hero-portrait" fallback={portrait} alt={`${c.hero.name} — professional portrait`} aspect="4 / 5" imgClassName="h-full w-full object-cover" label="Upload photo" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/15 bg-ink/60 px-4 py-3 backdrop-blur-md">
                <span className="text-sm font-semibold text-white">{c.hero.name}</span>
                <span className="text-xs text-blue-glow">Hover to replace</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2 — ABOUT */}
      <Section id="about">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeader index="01" eyebrow="About Me" title={<>A marketer who pairs <span className="text-gradient-blue">creative craft</span> with performance discipline.</>} />
          <div className="space-y-8">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-foreground">{c.about.paragraph}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="rounded-2xl border border-border bg-secondary/50 p-6 lg:p-8">
                <span className="eyebrow">{c.about.objectiveLabel}</span>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{c.about.objective}</p>
              </div>
            </Reveal>
            <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {c.about.features.map((f) => (
                <motion.div key={f.label} variants={staggerChild} className="card-premium flex items-start gap-3 p-5">
                  <Ico name={f.icon} className="h-5 w-5 shrink-0 text-blue" />
                  <span className="text-sm font-medium">{f.label}</span>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Section>

      {/* 3 — EXPERIENCE */}
      <Section id="experience" className="bg-secondary/40">
        <SectionHeader index="02" eyebrow="Experience" title="Experience Timeline" intro="A focused, ownership-driven role covering the full digital marketing lifecycle." />
        <div className="relative border-l border-border pl-8 lg:pl-12">
          {c.experience.map((e, i) => (
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
                    <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-muted-foreground">{e.period}</span>
                  </div>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {e.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue" />{p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                    {e.tools.map((t) => (
                      <span key={t} className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground">{t}</span>
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
        <SectionHeader index="03" eyebrow="Core Skills" title="Core Skills & Capabilities" intro="A balanced skill set across paid advertising, content, creative, AI tools, and analytics." />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <StaggerGroup className="grid gap-5 sm:grid-cols-2">
            {c.skills.groups.map((g) => (
              <motion.div key={g.category} variants={staggerChild} className="card-premium card-premium-hover p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue">{g.category}</h3>
                <div className="mt-5 space-y-4">
                  {g.skills.map((s) => (
                    <div key={s.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-blue)" }} initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
          <Reveal delay={0.15} className="card-premium flex flex-col p-6 lg:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue">Skill Focus Areas</h3>
            <p className="mt-2 text-sm text-muted-foreground">A snapshot of where my strengths concentrate across the marketing stack.</p>
            <div className="mt-2 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={c.skills.radar} outerRadius="72%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="area" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                  <Radar dataKey="value" stroke="var(--color-blue)" fill="var(--color-blue)" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 5 — PROCESS */}
      <Section id="process" className="relative overflow-hidden bg-ink text-white">
        <SectionHeader index="04" eyebrow="How I Work" dark title="The Digital Marketing Process" intro="A repeatable, six-stage approach that keeps every campaign structured from insight to impact." />
        <StaggerGroup className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {c.process.map((p, i) => (
            <motion.div key={p.title} variants={staggerChild} className="group relative bg-ink p-8 transition-colors hover:bg-white/[0.04]">
              <span className="text-xs font-bold tracking-widest text-white/25">0{i + 1}</span>
              <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-blue-glow">
                <Ico name={p.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{p.desc}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 6 — FEATURED PROJECT */}
      <Section id="project">
        <SectionHeader index="05" eyebrow="Featured Project" title={<>Case Study: <span className="text-gradient-blue">OM Value Homes</span></>} intro="End-to-end ownership of digital marketing for a real-estate brand — from strategy and creatives to campaigns and reporting." />
        <StaggerGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {c.project.map((b) => (
            <motion.div key={b.title} variants={staggerChild} className={`card-premium card-premium-hover p-7 ${b.title === "Results" ? "border-dashed border-blue/40 bg-blue/[0.03]" : ""}`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-blue">
                <Ico name={b.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 6b — CASE STUDY MEDIA */}
      <Section id="project-media" className="border-t border-border bg-secondary/30">
        <SectionHeader index="05.5" eyebrow="Case Study Media" title={<>Real creatives from <span className="text-gradient-blue">OM Value Homes</span></>} intro="A curated selection of live campaign creatives — property launches, awareness posts, lifestyle visuals, and local-SEO assets — all designed and shipped for OM Value Homes." />
        <Reveal className="mb-8">
          <div className="card-premium overflow-hidden rounded-2xl">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[520px]">
                <img src={omvhCreatives[0].src} alt={omvhCreatives[0].alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <figcaption className="sr-only">{omvhCreatives[0].desc}</figcaption>
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
                <span className="eyebrow">Featured Creative</span>
                <h3 className="text-2xl font-bold lg:text-3xl">{omvhCreatives[0].title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">{omvhCreatives[0].desc}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Meta Ads", "Lead Form", "Canva", "1 BHK Launch"].map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow">Creative Gallery</span>
          <span className="text-xs text-muted-foreground">{omvhCreatives.length - 1 + uploads.length} live creatives · social, awareness &amp; local SEO</span>
        </div>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {omvhCreatives.slice(1).map((cv) => (
            <motion.figure key={cv.title} variants={staggerChild} className="card-premium group overflow-hidden rounded-2xl">
              <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: cv.aspect }}>
                <img src={cv.src} alt={cv.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue">{cv.tag}</span>
                <h4 className="mt-2 text-sm font-bold">{cv.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{cv.desc}</p>
              </figcaption>
            </motion.figure>
          ))}
          {uploads.map((u) => (
            <motion.figure key={u.id} variants={staggerChild} className="card-premium group overflow-hidden rounded-2xl">
              <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: u.aspect }}>
                <img src={u.url} alt={u.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue">{u.tag}</span>
                <h4 className="mt-2 text-sm font-bold">{u.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{u.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </StaggerGroup>
      </Section>

      {/* 7 — CAMPAIGNS */}
      <Section id="campaigns" className="bg-secondary/40">
        <SectionHeader index="06" eyebrow="Campaign Showcase" title="Campaign Types I Deliver" intro="The core campaign formats I plan, build, and manage across paid and organic channels." />
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.campaigns.map((cm) => (
            <motion.div key={cm.title} variants={staggerChild} className="card-premium card-premium-hover group flex flex-col p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                  <Ico name={cm.icon} className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">{cm.tag}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{cm.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cm.desc}</p>
            </motion.div>
          ))}
          <motion.div variants={staggerChild} className="flex flex-col justify-center rounded-2xl border border-dashed border-blue/40 bg-blue/[0.03] p-7">
            <span className="eyebrow">Results</span>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Add Campaign Results Here — reach, leads, and engagement metrics can be added once verified figures are available.</p>
          </motion.div>
        </StaggerGroup>
      </Section>

      {/* 8 — CREATIVE PORTFOLIO */}
      <Section id="creative">
        <SectionHeader index="07" eyebrow="Creative Portfolio" title="Creative Formats & Design Work" intro="A range of on-brand creative assets designed in-house for social and promotional use." />
        <StaggerGroup className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {c.creative.map((cr) => (
            <motion.div key={cr.label} variants={staggerChild} className="card-premium card-premium-hover group flex aspect-[4/3] flex-col justify-between overflow-hidden p-6">
              <Ico name={cr.icon} className="h-6 w-6 text-blue transition-transform group-hover:scale-110" />
              <div>
                <h3 className="text-sm font-bold">{cr.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Add samples here</p>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 9 — TOOLS */}
      <Section id="tools" className="bg-secondary/40">
        <SectionHeader index="08" eyebrow="Marketing Tools" title="Tools & Platforms" intro="The day-to-day stack I use to plan, create, launch, and report on campaigns." />
        <StaggerGroup className="flex flex-wrap gap-3">
          {c.tools.map((t) => (
            <motion.span key={t} variants={staggerChild} className="card-premium card-premium-hover flex items-center gap-2 px-5 py-3 text-sm font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />{t}
            </motion.span>
          ))}
        </StaggerGroup>
      </Section>

      {/* 10 — AI WORKFLOW */}
      <Section id="ai">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeader index="09" eyebrow="AI Workflow" title={<>AI as a <span className="text-gradient-blue">creative co-pilot</span></>} intro="I use ChatGPT, Claude, and Gemini to work faster and think broader — while keeping human judgment on strategy and brand quality." />
            <Reveal delay={0.1}>
              <div className="card-premium flex items-center gap-4 p-6">
                <Sparkles className="h-6 w-6 shrink-0 text-blue" />
                <p className="text-sm text-muted-foreground">AI accelerates ideation and drafting; the strategy, brand voice, and final decisions stay human-led.</p>
              </div>
            </Reveal>
          </div>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {c.ai.map((a) => (
              <motion.div key={a.title} variants={staggerChild} className="card-premium card-premium-hover p-6">
                <Ico name={a.icon} className="h-5 w-5 text-blue" />
                <h3 className="mt-4 text-base font-bold">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* 11 — STRENGTHS */}
      <Section id="strengths" className="bg-secondary/40">
        <SectionHeader index="10" eyebrow="Professional Strengths" title="What I Bring to a Team" intro="The professional qualities that keep campaigns organised and collaboration smooth." />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.strengths.map((s) => (
            <motion.div key={s.title} variants={staggerChild} className="card-premium card-premium-hover flex items-center gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
                <Ico name={s.icon} className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold">{s.title}</span>
            </motion.div>
          ))}
        </StaggerGroup>
      </Section>

      {/* 12 — GOALS */}
      <Section id="goals">
        <SectionHeader index="11" eyebrow="Future Goals" title="Career & Growth Roadmap" intro="A clear direction for growth — deeper expertise, recognised certifications, and senior-level impact." />
        <div className="relative">
          <StaggerGroup className="grid gap-5 md:grid-cols-2">
            {c.goals.map((g, i) => (
              <motion.div key={g.title} variants={staggerChild} className="card-premium card-premium-hover p-7 lg:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-xs font-bold text-blue">0{i + 1}</span>
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
            <SectionHeader index="12" eyebrow="Contact" dark title={<>Let's build campaigns that <span className="text-gradient-blue">convert.</span></>} intro={c.contact.intro} />
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-blue-glow" />
              {c.contact.location}
            </div>
          </div>
          <div className="grid gap-4">
            <StaggerGroup className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Mail, label: "Email", value: c.contact.email },
                { icon: Phone, label: "Phone", value: c.contact.phone },
                { icon: Linkedin, label: "LinkedIn", value: c.contact.linkedin },
                { icon: Instagram, label: "Instagram", value: c.contact.instagram },
              ].map((cc) => (
                <motion.div key={cc.label} variants={staggerChild} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]">
                  <cc.icon className="h-5 w-5 text-blue-glow" />
                  <p className="mt-4 text-xs uppercase tracking-wider text-white/40">{cc.label}</p>
                  <p className="mt-1 text-sm font-medium break-words text-white/90">{cc.value}</p>
                </motion.div>
              ))}
            </StaggerGroup>
            <Reveal delay={0.2}>
              <a href={`mailto:${c.contact.email}`} className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-blue/90 hover:scale-[1.02] w-full sm:w-auto">
                <Send className="h-4 w-4" />Get in Touch
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
        <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} {c.hero.name} — {c.hero.role}</span>
          <span>{c.contact.footerLine}</span>
        </div>
      </Section>
    </div>
  );
}
