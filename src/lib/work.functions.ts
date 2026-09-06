import { createServerFn } from "@tanstack/react-start";

export const WORK_CATEGORIES = [
  { id: "post_creative", label: "Post Creatives" },
  { id: "ai_video", label: "AI Videos" },
  { id: "shoot_edit", label: "Shoot & Edit" },
  { id: "app_web", label: "App & Web Development" },
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number]["id"];
export type WorkMediaType = "image" | "video" | "youtube" | "link";

export type WorkItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  media_type: string;
  external_url: string | null;
  alt: string;
  aspect: string;
  featured: boolean;
  sort_order: number;
  url: string; // resolved media URL (signed upload or external)
  created_at: string;
};

const SELECT =
  "id, category, title, description, tag, media_type, storage_path, external_url, alt, aspect, featured, sort_order, created_at";

/** Public — list every work item with resolved media URLs. */
export const listWorkItems = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("work_items")
    .select(SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = data ?? [];

  const paths = rows.map((r) => r.storage_path).filter((p): p is string => !!p);
  const urlByPath = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await supabaseAdmin.storage
      .from("omvh-uploads")
      .createSignedUrls(paths, 60 * 60 * 24 * 365);
    for (const s of signed ?? []) urlByPath.set(s.path ?? "", s.signedUrl);
  }

  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    title: r.title,
    description: r.description,
    tag: r.tag,
    media_type: r.media_type,
    external_url: r.external_url,
    alt: r.alt,
    aspect: r.aspect,
    featured: r.featured,
    sort_order: r.sort_order,
    created_at: r.created_at,
    url: r.storage_path ? (urlByPath.get(r.storage_path) ?? "") : (r.external_url ?? ""),
  })) satisfies WorkItem[];
});

type WorkInput = {
  passcode: string;
  category: string;
  title: string;
  description?: string;
  tag?: string;
  media_type: string;
  external_url?: string;
  alt?: string;
  aspect?: string;
  featured?: boolean;
  sort_order?: number;
  // optional file upload
  filename?: string;
  contentType?: string;
  dataUrl?: string;
};

function clean(d: WorkInput) {
  return {
    category: d.category,
    title: (d.title || "").slice(0, 160),
    description: (d.description || "").slice(0, 1200),
    tag: (d.tag || "").slice(0, 80),
    media_type: d.media_type,
    external_url: d.external_url?.trim() ? d.external_url.trim() : null,
    alt: (d.alt || d.title || "").slice(0, 240),
    aspect: d.aspect || "1 / 1",
    featured: !!d.featured,
    sort_order: Number.isFinite(Number(d.sort_order)) ? Number(d.sort_order) : 0,
  };
}

async function uploadIfPresent(d: WorkInput) {
  if (!d.dataUrl) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const match = d.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid file data");
  const bytes = Buffer.from(match[2]!, "base64");
  if (bytes.byteLength > 45 * 1024 * 1024) throw new Error("File too large (max 45 MB)");
  const ext = (d.filename?.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `work/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("omvh-uploads")
    .upload(path, bytes, { contentType: d.contentType || match[1]!, upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

/** Admin — create a work item (optionally with an uploaded image/video). */
export const createWorkItem = createServerFn({ method: "POST" })
  .inputValidator((d: WorkInput) => d)
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const storage_path = await uploadIfPresent(data);
    const { error } = await supabaseAdmin
      .from("work_items")
      .insert({ ...clean(data), storage_path });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin — update a work item (optionally replacing its media). */
export const updateWorkItem = createServerFn({ method: "POST" })
  .inputValidator((d: WorkInput & { id: string }) => d)
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = clean(data);
    const storage_path = await uploadIfPresent(data);
    if (storage_path) patch["storage_path"] = storage_path;
    const { error } = await supabaseAdmin.from("work_items").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin — delete a work item and its stored file. */
export const deleteWorkItem = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; passcode: string }) => d)
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("work_items")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.storage_path) {
      await supabaseAdmin.storage.from("omvh-uploads").remove([row.storage_path]);
    }
    await supabaseAdmin.from("work_items").delete().eq("id", data.id);
    return { ok: true as const };
  });

/** Admin — verify the passcode (used by the /admin unlock screen). */
export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((d: { passcode: string }) => d)
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.passcode);
    return { ok: true as const };
  });
