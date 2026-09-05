import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Upload, Trash2, LogOut, Loader2, CheckCircle2, Save, RotateCcw, Pencil, X,
} from "lucide-react";
import {
  adminDelete, adminUpload, listOmvhUploads,
} from "@/lib/omvh.functions";
import {
  getSiteContent, updateSiteContent, resetSiteContent, updateOmvhUpload,
} from "@/lib/content.functions";
import {
  DEFAULT_CONTENT, CONTENT_KEYS, mergeContent, type ContentKey, type SiteContent,
} from "@/lib/content-defaults";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — Portfolio CMS" },
      { name: "description", content: "Private admin area for editing every portfolio section." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  return <AdminDashboard />;
}

type Tab = "gallery" | ContentKey;
const TABS: { id: Tab; label: string }[] = [
  { id: "gallery", label: "Gallery Uploads" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "process", label: "Process" },
  { id: "project", label: "Project (OMVH)" },
  { id: "campaigns", label: "Campaigns" },
  { id: "creative", label: "Creative Portfolio" },
  { id: "tools", label: "Tools" },
  { id: "ai", label: "AI Workflow" },
  { id: "strengths", label: "Strengths" },
  { id: "goals", label: "Future Goals" },
  { id: "application", label: "Application Summary" },
  { id: "contact", label: "Contact" },
];

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("gallery");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-lg font-semibold">Portfolio — Admin CMS</h1>
            <p className="text-xs text-muted-foreground">Edit any section below. Changes go live for every visitor instantly.</p>
          </div>
          <a href="/" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Exit
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${tab === t.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:bg-secondary/70"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "gallery" ? <GalleryTab /> : <ContentTab key={tab} sectionKey={tab} />}
      </div>
    </div>
  );
}

/* ------------------------------ GALLERY TAB ------------------------------ */

function GalleryTab() {
  const list = useServerFn(listOmvhUploads);
  const upload = useServerFn(adminUpload);
  const del = useServerFn(adminDelete);
  const updateMeta = useServerFn(updateOmvhUpload);
  const qc = useQueryClient();

  const { data: items = [] } = useQuery({ queryKey: ["omvh-uploads"], queryFn: () => list() });

  const uploadMut = useMutation({
    mutationFn: (v: Parameters<typeof upload>[0]["data"]) => upload({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["omvh-uploads"] }),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["omvh-uploads"] }),
  });
  const editMut = useMutation({
    mutationFn: (v: Parameters<typeof updateMeta>[0]["data"]) => updateMeta({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["omvh-uploads"] }),
  });

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Case Study Creative");
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [aspect, setAspect] = useState("1 / 1");
  const [order, setOrder] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
    await uploadMut.mutateAsync({
      filename: file.name, contentType: file.type, dataUrl,
      title, tag, caption, alt, aspect, sort_order: Number(order) || 0,
    });
    setFile(null); setTitle(""); setCaption(""); setAlt("");
    setSavedFlash(true); setTimeout(() => setSavedFlash(false), 2500);
    (document.getElementById("omvh-file") as HTMLInputElement | null)!.value = "";
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <form onSubmit={onSubmit} className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Add a creative</h2>
        <label className="mb-3 block text-xs font-medium">Image file
          <input id="omvh-file" type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-medium" />
        </label>
        <Field label="Title" value={title} onChange={setTitle} required />
        <Field label="Tag" value={tag} onChange={setTag} />
        <Field label="Alt text (SEO & accessibility)" value={alt} onChange={setAlt} required textarea />
        <Field label="Caption" value={caption} onChange={setCaption} required textarea />
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium">Aspect
            <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="1 / 1">Square (1:1)</option>
              <option value="4 / 5">Portrait (4:5)</option>
              <option value="16 / 10">Landscape (16:10)</option>
              <option value="16 / 9">Wide (16:9)</option>
              <option value="3 / 4">Portrait (3:4)</option>
            </select>
          </label>
          <label className="block text-xs font-medium">Sort order
            <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
        </div>
        <button type="submit" disabled={uploadMut.isPending || !file} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50">
          {uploadMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Upload
        </button>
        {savedFlash && <p className="mt-3 flex items-center gap-1.5 text-xs text-green-700"><CheckCircle2 className="h-3.5 w-3.5" /> Saved.</p>}
        {uploadMut.error && <p className="mt-3 text-xs text-red-600">{(uploadMut.error as Error).message}</p>}
      </form>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Live gallery ({items.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/3] bg-secondary"><img src={it.url} alt={it.alt} className="h-full w-full object-cover" /></div>
              <div className="p-4">
                {editing === it.id ? (
                  <EditItem item={it} busy={editMut.isPending} onCancel={() => setEditing(null)} onSave={async (patch) => { await editMut.mutateAsync({ id: it.id, ...patch }); setEditing(null); }} />
                ) : (
                  <>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{it.tag}</div>
                    <div className="mt-1 text-sm font-semibold">{it.title}</div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{it.caption}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button onClick={() => setEditing(it.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => { if (confirm("Delete this image?")) delMut.mutate(it.id); }} className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No uploads yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function EditItem({
  item, busy, onCancel, onSave,
}: {
  item: { id: string; title: string; tag: string; caption: string; alt: string; aspect: string; sort_order: number };
  busy: boolean;
  onCancel: () => void;
  onSave: (patch: { title: string; tag: string; caption: string; alt: string; aspect: string; sort_order: number }) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [tag, setTag] = useState(item.tag);
  const [caption, setCaption] = useState(item.caption);
  const [alt, setAlt] = useState(item.alt);
  const [aspect, setAspect] = useState(item.aspect);
  const [order, setOrder] = useState(item.sort_order);
  return (
    <div className="space-y-2">
      <Field label="Title" value={title} onChange={setTitle} />
      <Field label="Tag" value={tag} onChange={setTag} />
      <Field label="Alt" value={alt} onChange={setAlt} textarea />
      <Field label="Caption" value={caption} onChange={setCaption} textarea />
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs font-medium">Aspect
          <input value={aspect} onChange={(e) => setAspect(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block text-xs font-medium">Order
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button disabled={busy} onClick={() => onSave({ title, tag, caption, alt, aspect, sort_order: order })} className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background disabled:opacity-50">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ CONTENT TAB ------------------------------ */

function ContentTab({ sectionKey }: { sectionKey: ContentKey }) {
  const fetchContent = useServerFn(getSiteContent);
  const update = useServerFn(updateSiteContent);
  const reset = useServerFn(resetSiteContent);
  const qc = useQueryClient();

  const { data: raw, isLoading } = useQuery({ queryKey: ["site-content"], queryFn: () => fetchContent() });
  const merged: SiteContent = useMemo(() => mergeContent(raw), [raw]);
  const current = merged[sectionKey];
  const isDefault = !raw || raw[sectionKey] === undefined;

  const [text, setText] = useState<string>(() => JSON.stringify(current, null, 2));
  const [parseErr, setParseErr] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  // Reset editor when tab changes or data reloads
  useEffect(() => { setText(JSON.stringify(current, null, 2)); setParseErr(null); }, [sectionKey, raw]); // eslint-disable-line

  const saveMut = useMutation({
    mutationFn: (data: unknown) => update({ data: { key: sectionKey, data } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-content"] });
      setFlash("Saved — live on the site."); setTimeout(() => setFlash(null), 2500);
    },
  });
  const resetMut = useMutation({
    mutationFn: () => reset({ data: { key: sectionKey } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-content"] });
      setFlash("Reset to default."); setTimeout(() => setFlash(null), 2500);
    },
  });

  function handleSave() {
    let parsed: unknown;
    try { parsed = JSON.parse(text); setParseErr(null); }
    catch (e) { setParseErr((e as Error).message); return; }
    saveMut.mutate(parsed);
  }
  function loadDefault() {
    setText(JSON.stringify(DEFAULT_CONTENT[sectionKey], null, 2));
  }

  if (isLoading) return <div className="grid place-items-center p-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{sectionKey}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Edit the JSON below. Structure must match the schema shown on the right. {isDefault ? "(Currently using default values.)" : "(Custom content saved.)"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadDefault} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
              <RotateCcw className="h-3.5 w-3.5" /> Load default
            </button>
            {!isDefault && (
              <button disabled={resetMut.isPending} onClick={() => { if (confirm("Reset this section to default?")) resetMut.mutate(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                Reset saved
              </button>
            )}
            <button disabled={saveMut.isPending} onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-semibold text-background disabled:opacity-50">
              {saveMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="h-[70vh] w-full rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed outline-none focus:border-foreground"
        />
        {parseErr && <p className="mt-2 text-xs text-red-600">JSON error: {parseErr}</p>}
        {saveMut.error && <p className="mt-2 text-xs text-red-600">{(saveMut.error as Error).message}</p>}
        {flash && <p className="mt-2 flex items-center gap-1.5 text-xs text-green-700"><CheckCircle2 className="h-3.5 w-3.5" /> {flash}</p>}
      </div>

      <aside className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Schema hint</h3>
        <p className="mt-2 text-xs text-muted-foreground">Copy this default and edit fields. Icon values are strings — see the list below.</p>
        <pre className="mt-3 max-h-[40vh] overflow-auto rounded-lg bg-secondary/60 p-3 font-mono text-[11px] leading-relaxed">{JSON.stringify(DEFAULT_CONTENT[sectionKey], null, 2)}</pre>
        <h4 className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Available icons</h4>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Target, PenLine, Megaphone, LineChart, Search, CalendarRange, Palette, Rocket, Gauge, FileBarChart, Sparkles, MessageSquare, Building2, Users, MapPin, Mail, Phone, Linkedin, Globe, QrCode, BadgeCheck, Brain, Lightbulb, Clock, Handshake, GraduationCap, TrendingUp, Instagram, Facebook, FileText, Image, Layers
        </p>
        <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-[11px] text-muted-foreground">
          Sections available: {CONTENT_KEYS.join(", ")}.
        </div>
      </aside>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, required, textarea,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; textarea?: boolean;
}) {
  return (
    <label className="mb-3 block text-xs font-medium">
      {label}
      {textarea ? (
        <textarea value={value} required={required} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
      ) : (
        <input value={value} required={required} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
      )}
    </label>
  );
}
