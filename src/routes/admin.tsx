import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Lock, Upload, Trash2, LogOut, Loader2, CheckCircle2 } from "lucide-react";
import {
  adminDelete,
  adminStatus,
  adminUpload,
  listOmvhUploads,
  lockAdmin,
  unlockAdmin,
} from "@/lib/omvh.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — OM Value Homes Uploads" },
      { name: "description", content: "Private admin area for managing portfolio case-study images." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  const status = useServerFn(adminStatus);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    status().then((r) => setUnlocked(r.unlocked)).catch(() => setUnlocked(false));
  }, [status]);

  if (unlocked === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return unlocked ? <AdminDashboard onLock={() => setUnlocked(false)} /> : <PasscodeGate onUnlock={() => setUnlocked(true)} />;
}

function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const unlock = useServerFn(unlockAdmin);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    try {
      const res = await unlock({ data: { passcode: pass } });
      if (res.ok) onUnlock();
      else setErr(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Admin access</h1>
            <p className="text-xs text-muted-foreground">Enter passcode to manage case-study images.</p>
          </div>
        </div>
        <input
          type="password"
          autoFocus
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Passcode"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground"
        />
        {err && <p className="mt-2 text-xs text-red-600">Incorrect passcode.</p>}
        <button
          type="submit"
          disabled={busy || !pass}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard({ onLock }: { onLock: () => void }) {
  const list = useServerFn(listOmvhUploads);
  const upload = useServerFn(adminUpload);
  const del = useServerFn(adminDelete);
  const lock = useServerFn(lockAdmin);
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

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Case Study Creative");
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [aspect, setAspect] = useState("1 / 1");
  const [order, setOrder] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);

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
      filename: file.name,
      contentType: file.type,
      dataUrl,
      title,
      tag,
      caption,
      alt,
      aspect,
      sort_order: Number(order) || 0,
    });
    setFile(null);
    setTitle("");
    setCaption("");
    setAlt("");
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
    (document.getElementById("omvh-file") as HTMLInputElement | null)!.value = "";
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-lg font-semibold">OM Value Homes — Admin</h1>
            <p className="text-xs text-muted-foreground">
              Upload images here and they appear in the public case-study gallery for every visitor.
            </p>
          </div>
          <button
            onClick={async () => {
              await lock();
              onLock();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Lock
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[420px_1fr]">
        <form onSubmit={onSubmit} className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Add a creative
          </h2>

          <label className="mb-3 block text-xs font-medium">Image file
            <input
              id="omvh-file"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-medium"
            />
          </label>

          <Field label="Title" value={title} onChange={setTitle} placeholder="e.g. Monsoon Offer Campaign" required />
          <Field label="Tag" value={tag} onChange={setTag} placeholder="e.g. Awareness Campaign" />
          <Field label="Alt text (for SEO & accessibility)" value={alt} onChange={setAlt} placeholder="Describe what is visible in the image" required textarea />
          <Field label="Caption" value={caption} onChange={setCaption} placeholder="One-line description shown below the image" required textarea />

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium">Aspect
              <select
                value={aspect}
                onChange={(e) => setAspect(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="1 / 1">Square (1:1)</option>
                <option value="4 / 5">Portrait (4:5)</option>
                <option value="16 / 10">Landscape (16:10)</option>
                <option value="16 / 9">Wide (16:9)</option>
                <option value="3 / 4">Portrait (3:4)</option>
              </select>
            </label>
            <label className="block text-xs font-medium">Sort order
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={uploadMut.isPending || !file}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"
          >
            {uploadMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload creative
          </button>
          {savedFlash && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved — visible to everyone now.
            </p>
          )}
          {uploadMut.error && (
            <p className="mt-3 text-xs text-red-600">{(uploadMut.error as Error).message}</p>
          )}
        </form>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Live gallery ({items.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => (
              <div key={it.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[4/3] bg-secondary">
                  <img src={it.url} alt={it.alt} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {it.tag}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{it.title}</div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{it.caption}</p>
                  <button
                    onClick={() => {
                      if (confirm("Delete this image?")) delMut.mutate(it.id);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No uploads yet. Add one on the left — it appears instantly on the homepage.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="mb-3 block text-xs font-medium">
      {label}
      {textarea ? (
        <textarea
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      ) : (
        <input
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      )}
    </label>
  );
}
