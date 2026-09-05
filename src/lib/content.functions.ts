import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { CONTENT_KEYS, type ContentKey } from "./content-defaults";

type AdminSession = { unlocked?: boolean };

function getSessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password) throw new Error("SESSION_SECRET not configured");
  return {
    password,
    name: "omvh-admin",
    maxAge: 60 * 60 * 24 * 30,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

async function requireAdmin(passcode?: string) {
  const expected = process.env.ADMIN_PASSCODE;
  if (passcode && expected && passcode === expected) return;
  const session = await useSession<AdminSession>(getSessionConfig());
  if (!session.data.unlocked) {
    throw new Error("Unauthorized — please enter the admin passcode again.");
  }
}


type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

/** Public — returns { key: data } map for all sections. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("key, data");
  if (error) throw new Error(error.message);
  const map: Record<string, Json> = {};
  for (const row of data ?? []) map[row.key] = row.data as Json;
  return map;
});

/** Admin — upsert one section. */
export const updateSiteContent = createServerFn({ method: "POST" })
  .inputValidator((d: { key: string; data: unknown; passcode?: string }) => {
    if (!CONTENT_KEYS.includes(d.key as ContentKey)) {
      throw new Error(`Invalid section key: ${d.key}`);
    }
    return { key: d.key as ContentKey, data: d.data, passcode: d.passcode };
  })
  .handler(async ({ data }) => {
    await requireAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: data.key, data: data.data as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin — reset one section (delete row → falls back to default). */
export const resetSiteContent = createServerFn({ method: "POST" })
  .inputValidator((d: { key: string; passcode?: string }) => ({ key: d.key, passcode: d.passcode }))
  .handler(async ({ data }) => {
    await requireAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("site_content").delete().eq("key", data.key);
    return { ok: true as const };
  });

/** Admin — update gallery item metadata. */
export const updateOmvhUpload = createServerFn({ method: "POST" })
  .inputValidator((d: {
    id: string;
    title?: string;
    tag?: string;
    caption?: string;
    alt?: string;
    aspect?: string;
    sort_order?: number;
    passcode?: string;
  }) => d)
  .handler(async ({ data }) => {
    await requireAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: {
      title?: string; tag?: string; caption?: string; alt?: string;
      aspect?: string; sort_order?: number;
    } = {};
    if (data.title !== undefined) patch.title = data.title.slice(0, 120);
    if (data.tag !== undefined) patch.tag = data.tag.slice(0, 60);
    if (data.caption !== undefined) patch.caption = data.caption.slice(0, 500);
    if (data.alt !== undefined) patch.alt = data.alt.slice(0, 240);
    if (data.aspect !== undefined) patch.aspect = data.aspect;
    if (data.sort_order !== undefined) patch.sort_order = Number(data.sort_order) || 0;
    const { error } = await supabaseAdmin.from("omvh_uploads").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
