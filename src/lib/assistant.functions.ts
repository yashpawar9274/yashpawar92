import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mergeContent, type SiteContent } from "@/lib/content-defaults";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";

const AskInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(20),
});

function gatewayError(status: number, body: string) {
  if (status === 402) return new Error("The assistant has run out of AI credits. Please try again later.");
  if (status === 429) return new Error("Too many requests right now — please try again in a few seconds.");
  if (status === 403) return new Error("The assistant is currently unavailable.");
  return new Error(`Assistant error (${status}): ${body.slice(0, 200)}`);
}

/** Compact, plain-text profile of Yash built from the live CMS content. */
async function buildProfile(): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_content").select("key, data");
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.data;
  const c: SiteContent = mergeContent(map);

  const { data: work } = await supabaseAdmin
    .from("work_items")
    .select("title, description, category, tag")
    .order("sort_order", { ascending: true })
    .limit(30);

  const lines: string[] = [];
  lines.push(`NAME: ${c.hero.name}`);
  lines.push(`HEADLINE: ${c.hero.role}`);
  lines.push(`SUMMARY: ${c.hero.tagline}`);
  lines.push(`LOCATION: ${c.contact.location}`);
  lines.push(`ABOUT: ${c.about.paragraph}`);
  lines.push(`OBJECTIVE: ${c.about.objective}`);
  lines.push(
    "CAPABILITIES:\n" +
      c.capabilities.items.map((i) => `- ${i.title}: ${i.desc} (${(i.tags ?? []).join(", ")})`).join("\n"),
  );
  lines.push(
    "EXPERIENCE:\n" +
      c.experience
        .map((e) => `- ${e.role} at ${e.org} (${e.period}): ${e.points.join(" ")} Tools: ${e.tools.join(", ")}`)
        .join("\n"),
  );
  lines.push(
    "SKILLS:\n" +
      c.skills.groups.map((g) => `- ${g.category}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n"),
  );
  lines.push(
    "FEATURED PROJECT (OM VALUE HOMES):\n" + c.project.map((p) => `- ${p.title}: ${p.body}`).join("\n"),
  );
  lines.push(
    `APPLICATION: ${c.application.summary} Preferred roles: ${c.application.preferredRoles.join(", ")}. Industries: ${c.application.preferredIndustries.join(", ")}. Locations: ${c.application.preferredLocations.join(", ")}. Work mode: ${c.application.workMode}. Availability: ${c.application.availability}. Notice: ${c.application.noticePeriod}.`,
  );
  lines.push(
    `CONTACT: email ${c.contact.email}, phone ${c.contact.phone}, LinkedIn ${c.contact.linkedin}, website ${c.contact.website}`,
  );
  if (work?.length) {
    lines.push(
      "RECENT WORK:\n" + work.map((w) => `- [${w.category}] ${w.title}: ${w.description ?? ""}`).join("\n"),
    );
  }
  return lines.join("\n\n");
}

/** Answers a visitor question about Yash using the live portfolio content. */
export const assistantAsk = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AskInput.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("The assistant is not configured yet.");

    const profile = await buildProfile();
    const system = `You are Yash Pawar's friendly voice assistant on his portfolio website. You speak on his behalf to recruiters and clients.

RULES
- Answer ONLY from the profile below. If something is not in it, say you don't have that detail and suggest contacting Yash.
- Never invent numbers, clients, awards or achievements.
- Keep answers short and spoken-friendly: 2-4 sentences, plain words, no markdown, no bullet points, no emojis.
- Reply in the same language the visitor uses (English, Hindi or Hinglish).
- Be warm and confident, never salesy.
- End roughly every second answer with one short natural follow-up question.

PROFILE
${profile}`;

    const res = await fetch(`${GATEWAY}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
        max_tokens: 400,
      }),
    });
    if (!res.ok) throw gatewayError(res.status, await res.text());
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = json.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("The assistant had nothing to say — please try again.");
    return { reply };
  });

/** Turns assistant text into natural speech (base64 mp3). */
export const assistantSpeak = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        text: z.string().min(1).max(1200),
        instructions: z
          .string()
          .max(400)
          .default(
            "Speak like a warm, natural young Indian professional: conversational pace, friendly, clear, not robotic.",
          ),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("The assistant is not configured yet.");

    const res = await fetch(`${GATEWAY}/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: data.text,
        voice: "alloy",
        response_format: "mp3",
        instructions: data.instructions,
      }),
    });
    if (!res.ok) throw gatewayError(res.status, await res.text());
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return { audio: `data:audio/mpeg;base64,${btoa(bin)}` };
  });

/** Transcribes a recorded question (base64 audio data URL). */
export const assistantTranscribe = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ audio: z.string().min(20), mimeType: z.string().default("audio/webm") }).parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("The assistant is not configured yet.");

    const base64 = data.audio.includes(",") ? data.audio.split(",")[1]! : data.audio;
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const form = new FormData();
    form.append("model", "openai/gpt-4o-mini-transcribe");
    const ext = data.mimeType.includes("mp4") ? "mp4" : data.mimeType.includes("wav") ? "wav" : data.mimeType.includes("mpeg") ? "mp3" : data.mimeType.includes("ogg") ? "ogg" : "webm";
    form.append("file", new Blob([bytes], { type: data.mimeType }), `question.${ext}`);

    const res = await fetch(`${GATEWAY}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
    if (!res.ok) throw gatewayError(res.status, await res.text());
    const json = (await res.json()) as { text?: string };
    return { text: (json.text ?? "").trim() };
  });
