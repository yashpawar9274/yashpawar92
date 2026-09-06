import { useState } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, PlayCircle, Sparkles } from "lucide-react";
import { listWorkItems, WORK_CATEGORIES, type WorkItem } from "@/lib/work.functions";
import { Reveal, StaggerGroup, staggerChild } from "./reveal";

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? (m[1] ?? null) : null;
}

function Media({ item }: { item: WorkItem }) {
  const aspect = item.aspect || "1 / 1";
  if (item.media_type === "youtube") {
    const id = youtubeId(item.external_url ?? item.url ?? "");
    return (
      <div className="relative w-full overflow-hidden bg-ink" style={{ aspectRatio: aspect }}>
        {id ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : null}
      </div>
    );
  }
  if (item.media_type === "video") {
    return (
      <div className="relative w-full overflow-hidden bg-ink" style={{ aspectRatio: aspect }}>
        <video src={item.url} controls playsInline preload="metadata" aria-label={item.title} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }
  if (item.media_type === "link") {
    return (
      <div className="flex w-full items-center gap-3 bg-secondary/60 px-6 py-8" style={{ minHeight: 120 }}>
        <PlayCircle className="h-6 w-6 shrink-0 text-blue" />
        <span className="truncate text-sm font-semibold text-foreground">{item.external_url}</span>
      </div>
    );
  }
  return (
    <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: aspect }}>
      <img src={item.url} alt={item.alt || item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
    </div>
  );
}

export function WorkShowcase() {
  const fetchWork = useServerFn(listWorkItems);
  const { data: items = [] } = useQuery({
    queryKey: ["work-items"],
    queryFn: () => fetchWork(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? items : items.filter((i) => i.category === active);
  const counts = new Map<string, number>();
  for (const i of items) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);

  return (
    <section id="work" className="border-t border-border bg-background px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="eyebrow">My Work</span>
            <span className="text-xs font-semibold tracking-widest text-muted-foreground/50">/ 07.2</span>
          </div>
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
            Post creatives, AI videos, <span className="text-gradient-blue">shoot &amp; edit</span>, and app / web builds
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground lg:text-lg">
            A live showcase of the work I produce myself — designed posts and ad creatives, AI-generated video, on-location shoots with editing, and the apps and websites I build for marketing and sales teams.
          </p>
        </Reveal>

        <div className="mb-10 flex flex-wrap gap-2">
          {[{ id: "all", label: `All (${items.length})` },
            ...WORK_CATEGORIES.map((c) => ({ id: c.id as string, label: `${c.label} (${counts.get(c.id) ?? 0})` }))].map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-colors ${active === t.id ? "bg-ink text-white" : "border border-border bg-background text-muted-foreground hover:bg-secondary"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-sm text-muted-foreground">
            <Sparkles className="h-5 w-5 text-blue" />
            New work is being added here — post creatives, AI videos, shoots, and app builds.
          </div>
        ) : (
          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => {
              const label = WORK_CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category;
              const inner = (
                <>
                  <Media item={item} />
                  <div className="p-5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-blue">{item.tag || label}</span>
                    <h3 className="mt-2 text-sm font-bold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                    )}
                    {item.external_url && item.media_type !== "youtube" && (
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue">
                        Open <ArrowUpRight className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </>
              );
              const cls = "card-premium card-premium-hover group block overflow-hidden rounded-2xl";
              const clickable = item.external_url && item.media_type !== "youtube" && item.media_type !== "video";
              return (
                <motion.div key={item.id} variants={staggerChild}>
                  {clickable ? (
                    <a href={item.external_url!} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </motion.div>
              );
            })}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
