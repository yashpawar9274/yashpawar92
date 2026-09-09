import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { FIELD_LABELS, ICON_NAMES } from "@/lib/content-defaults";

/* Generic, form-based editor for any section of the site content.
   No JSON typing required — plain text boxes, number inputs, icon pickers,
   and add/remove/reorder controls for lists. */

const LONG_KEYS = new Set([
  "tagline", "paragraph", "objective", "desc", "body", "summary",
  "positioning", "intro", "caption", "alt", "description",
]);

function labelFor(key: string) {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v ?? null)) as T;
}

function blankFrom(template: unknown): unknown {
  if (Array.isArray(template)) return [];
  if (template && typeof template === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(template as Record<string, unknown>)) {
      out[k] = blankFrom(v);
    }
    return out;
  }
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  return "";
}

export function FieldEditor({
  value, template, onChange, fieldKey, depth = 0,
}: {
  value: unknown;
  template: unknown;
  onChange: (v: unknown) => void;
  fieldKey?: string;
  depth?: number;
}) {
  /* ---------- arrays ---------- */
  if (Array.isArray(template) || Array.isArray(value)) {
    const arr = Array.isArray(value) ? value : [];
    const itemTemplate = (Array.isArray(template) ? template[0] : undefined) ?? arr[0] ?? "";
    const simple = typeof itemTemplate !== "object" || itemTemplate === null;

    const set = (next: unknown[]) => onChange(next);
    const move = (i: number, dir: -1 | 1) => {
      const next = [...arr];
      const j = i + dir;
      if (j < 0 || j >= next.length) return;
      [next[i], next[j]] = [next[j], next[i]];
      set(next);
    };

    return (
      <div className="space-y-2">
        {arr.map((item, i) => (
          <div
            key={i}
            className={simple ? "flex items-center gap-2" : "rounded-xl border border-border bg-background p-3"}
          >
            <div className="flex-1">
              {simple ? (
                <FieldEditor
                  value={item}
                  template={itemTemplate}
                  fieldKey={fieldKey}
                  depth={depth + 1}
                  onChange={(v) => { const n = [...arr]; n[i] = v; set(n); }}
                />
              ) : (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Item {i + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <IconBtn onClick={() => move(i, -1)} title="Move up"><ChevronUp className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn onClick={() => move(i, 1)} title="Move down"><ChevronDown className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn onClick={() => set(arr.filter((_, k) => k !== i))} title="Remove" danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                    </div>
                  </div>
                  <FieldEditor
                    value={item}
                    template={itemTemplate}
                    depth={depth + 1}
                    onChange={(v) => { const n = [...arr]; n[i] = v; set(n); }}
                  />
                </>
              )}
            </div>
            {simple && (
              <div className="flex items-center gap-1">
                <IconBtn onClick={() => move(i, -1)} title="Move up"><ChevronUp className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn onClick={() => move(i, 1)} title="Move down"><ChevronDown className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn onClick={() => set(arr.filter((_, k) => k !== i))} title="Remove" danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => set([...arr, deepClone(blankFrom(itemTemplate))])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    );
  }

  /* ---------- objects ---------- */
  if ((template && typeof template === "object") || (value && typeof value === "object")) {
    const tmpl = (template && typeof template === "object" ? template : value) as Record<string, unknown>;
    const obj = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    return (
      <div className={depth === 0 ? "space-y-5" : "space-y-3"}>
        {Object.keys(tmpl).map((k) => (
          <div key={k}>
            <div className="mb-1.5 text-xs font-semibold text-foreground">{labelFor(k)}</div>
            <FieldEditor
              value={obj[k]}
              template={tmpl[k]}
              fieldKey={k}
              depth={depth + 1}
              onChange={(v) => onChange({ ...obj, [k]: v })}
            />
          </div>
        ))}
      </div>
    );
  }

  /* ---------- primitives ---------- */
  if (fieldKey === "icon") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {!ICON_NAMES.includes(String(value ?? "") as never) && <option value={String(value ?? "")}>{String(value ?? "— pick —")}</option>}
        {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    );
  }

  if (typeof template === "number" || typeof value === "number") {
    return (
      <input
        type="number"
        value={Number(value ?? 0)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      />
    );
  }

  if (typeof template === "boolean" || typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-xs">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        Enabled
      </label>
    );
  }

  const text = String(value ?? "");
  const long = (fieldKey && LONG_KEYS.has(fieldKey)) || text.length > 90;
  return long ? (
    <textarea
      value={text}
      rows={Math.min(8, Math.max(2, Math.ceil(text.length / 80)))}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-foreground"
    />
  ) : (
    <input
      value={text}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
    />
  );
}

function IconBtn({
  onClick, title, children, danger,
}: { onClick: () => void; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md border border-border p-1 hover:bg-secondary ${danger ? "text-red-600" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}
