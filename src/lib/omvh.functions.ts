import { createServerFn } from "@tanstack/react-start";

export type OmvhUpload = {
  id: string;
  title: string;
  tag: string;
  caption: string;
  alt: string;
  aspect: string;
  url: string;
  sort_order: number;
  created_at: string;
};

async function requireAdmin(passcode?: string) {
  const { assertAdmin } = await import("./admin-auth.server");
  assertAdmin(passcode);
}

/** Public — list all uploads with fresh signed URLs. */
export const listOmvhUploads = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("omvh_uploads")
    .select("id, title, tag, caption, alt, aspect, storage_path, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  if (!data?.length) return [] as OmvhUpload[];

  const paths = data.map((r) => r.storage_path);
  const { data: signed, error: signErr } = await supabaseAdmin.storage
    .from("omvh-uploads")
    .createSignedUrls(paths, 60 * 60 * 24 * 365); // 1 year
  if (signErr) throw new Error(signErr.message);

  const urlByPath = new Map(signed?.map((s) => [s.path ?? "", s.signedUrl]) ?? []);
  return data.map((r) => ({
    id: r.id,
    title: r.title,
    tag: r.tag,
    caption: r.caption,
    alt: r.alt,
    aspect: r.aspect,
    sort_order: r.sort_order,
    created_at: r.created_at,
    url: urlByPath.get(r.storage_path) ?? "",
  })) satisfies OmvhUpload[];
});

/** Admin-only: upload a new creative. */
export const adminUpload = createServerFn({ method: "POST" })
  .inputValidator((d: {
    filename: string;
    contentType: string;
    dataUrl: string; // base64 data URL
    title: string;
    tag: string;
    caption: string;
    alt: string;
    aspect: string;
    sort_order?: number;
    passcode?: string;
  }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const match = data.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid file data");
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.byteLength > 15 * 1024 * 1024) throw new Error("File too large (max 15 MB)");

    const ext = (data.filename.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("omvh-uploads")
      .upload(path, bytes, { contentType: data.contentType || match[1], upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { error: insErr } = await supabaseAdmin.from("omvh_uploads").insert({
      storage_path: path,
      title: data.title.slice(0, 120),
      tag: (data.tag || "Case Study Creative").slice(0, 60),
      caption: data.caption.slice(0, 500),
      alt: data.alt.slice(0, 240),
      aspect: data.aspect || "1 / 1",
      sort_order: Number.isFinite(data.sort_order) ? Number(data.sort_order) : 0,
    });
    if (insErr) throw new Error(insErr.message);
    return { ok: true as const };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; passcode?: string }) => ({ id: String(d.id), passcode: d.passcode }))
  .handler(async ({ data }) => {
    await requireAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("omvh_uploads")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.storage_path) {
      await supabaseAdmin.storage.from("omvh-uploads").remove([row.storage_path]);
    }
    await supabaseAdmin.from("omvh_uploads").delete().eq("id", data.id);
    return { ok: true as const };
  });
