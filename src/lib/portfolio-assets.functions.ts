import { createServerFn } from "@tanstack/react-start";

export type PortfolioAssets = {
  profileImageUrl: string | null;
  resumeUrl: string | null;
};

const ASSET_KEYS = ["profile_image", "resume"] as const;
type AssetKey = (typeof ASSET_KEYS)[number];

/** Public - retrieves database-backed profile photo and resume download. */
export const getPortfolioAssets = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("portfolio_assets")
    .select("asset_key, storage_path")
    .in("asset_key", ASSET_KEYS);
  if (error) throw new Error(error.message);

  const paths = (data ?? []).map((row) => row.storage_path);
  const { data: signed, error: signedError } = paths.length
    ? await supabaseAdmin.storage.from("omvh-uploads").createSignedUrls(paths, 60 * 60 * 24 * 365)
    : { data: [], error: null };
  if (signedError) throw new Error(signedError.message);

  const urls = new Map((signed ?? []).map((item) => [item.path ?? "", item.signedUrl ?? ""]));
  const result: PortfolioAssets = { profileImageUrl: null, resumeUrl: null };
  for (const row of data ?? []) {
    if (row.asset_key === "profile_image") result.profileImageUrl = urls.get(row.storage_path) ?? null;
    if (row.asset_key === "resume") result.resumeUrl = urls.get(row.storage_path) ?? null;
  }
  return result;
});

type UpdateAssetInput = {
  passcode: string;
  assetKey: AssetKey;
  filename: string;
  contentType: string;
  dataUrl: string;
};

/** Admin - replaces the selected asset in Storage and keeps its current record in the database. */
export const updatePortfolioAsset = createServerFn({ method: "POST" })
  .inputValidator((data: UpdateAssetInput) => {
    if (!ASSET_KEYS.includes(data.assetKey)) throw new Error("Invalid portfolio asset.");
    return data;
  })
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.passcode);
    const match = data.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid file upload.");
    const bytes = Buffer.from(match[2]!, "base64");
    const max = data.assetKey === "profile_image" ? 8 * 1024 * 1024 : 15 * 1024 * 1024;
    if (bytes.byteLength > max) throw new Error(`File too large. Maximum is ${max / 1024 / 1024} MB.`);
    if (data.assetKey === "profile_image" && !match[1]!.startsWith("image/")) throw new Error("Profile picture must be an image.");
    if (data.assetKey === "resume" && !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(match[1]!)) {
      throw new Error("Resume must be a PDF or DOCX file.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: old, error: lookupError } = await supabaseAdmin
      .from("portfolio_assets")
      .select("storage_path")
      .eq("asset_key", data.assetKey)
      .maybeSingle();
    if (lookupError) throw new Error(lookupError.message);

    const ext = (data.filename.split(".").pop() || (data.assetKey === "resume" ? "pdf" : "jpg"))
      .toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `portfolio-assets/${data.assetKey}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("omvh-uploads")
      .upload(path, bytes, { contentType: data.contentType || match[1]!, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { error: saveError } = await supabaseAdmin
      .from("portfolio_assets")
      .upsert({ asset_key: data.assetKey, storage_path: path }, { onConflict: "asset_key" });
    if (saveError) {
      await supabaseAdmin.storage.from("omvh-uploads").remove([path]);
      throw new Error(saveError.message);
    }
    if (old?.storage_path) await supabaseAdmin.storage.from("omvh-uploads").remove([old.storage_path]);
    return { ok: true as const };
  });
