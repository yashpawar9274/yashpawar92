import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev";
const MODEL = "google/gemini-3.1-flash-tts-preview";
const VOICE = "Puck";

const Body = z.object({
  text: z.string().min(1).max(1200),
  instructions: z.string().max(400).optional(),
});

export const Route = createFileRoute("/api/speak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("The assistant is not configured yet.", { status: 500 });
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Invalid request", { status: 400 });
        const { text, instructions } = parsed.data;
        const style = instructions?.trim() || "warm, natural, friendly, conversational, like a real young Indian professional";
        const prompt = `Say the following in a ${style} tone, at a natural human pace with real emotion:\n\n${text}`;

        try {
          const upstream = await fetch(`${GATEWAY}/v1/audio/speech`, {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: MODEL,
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
              },
              stream_format: "sse",
            }),
            signal: request.signal,
          });
          if (!upstream.ok || !upstream.body) {
            const msg =
              upstream.status === 402
                ? "The assistant has run out of AI credits."
                : upstream.status === 429
                  ? "Too many requests — please try again in a few seconds."
                  : `Speech failed (${upstream.status})`;
            return new Response(msg, { status: upstream.status });
          }
          return new Response(upstream.body, {
            headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
          });
        } catch (e) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return new Response("Speech failed", { status: 502 });
        }
      },
    },
  },
});
