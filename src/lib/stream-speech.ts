import { createParser } from "eventsource-parser";

function decodePCM(pending: Uint8Array, incoming: Uint8Array) {
  const bytes = new Uint8Array(pending.length + incoming.length);
  bytes.set(pending);
  bytes.set(incoming, pending.length);
  const usable = bytes.length - (bytes.length % 2);
  const view = new DataView(bytes.buffer);
  const samples = new Float32Array(usable / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = view.getInt16(i * 2, true) / 32768;
  return { samples, pending: bytes.slice(usable) };
}

/** Streams Gemini TTS (24 kHz PCM over SSE) and plays it as it arrives. */
export async function streamSpeech(
  text: string,
  instructions: string | undefined,
  signal: AbortSignal,
  onStart?: () => void,
): Promise<void> {
  signal.throwIfAborted();
  const context = new AudioContext({ sampleRate: 24000 });
  const sources = new Set<AudioBufferSourceNode>();
  let playhead = 0;
  let pending: Uint8Array = new Uint8Array(0);
  let completed = false;
  let samplesPlayed = 0;
  let started = false;
  let last: Promise<void> = Promise.resolve();
  const stopAll = () => {
    for (const s of sources) {
      try { s.stop(); } catch { /* already stopped */ }
    }
  };
  signal.addEventListener("abort", stopAll, { once: true });
  try {
    if (context.state === "suspended") await context.resume();
    const response = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, instructions }),
      signal,
    });
    if (!response.ok || !response.body) throw new Error((await response.text()) || `Speech failed (${response.status})`);
    const parser = createParser({
      onEvent(event) {
        const payload = JSON.parse(event.data) as { type?: string; audio?: string; error?: unknown };
        if (payload.type === "error" || payload.error) throw new Error("Speech failed");
        if (payload.type === "speech.audio.done") { completed = true; return; }
        if (payload.type !== "speech.audio.delta" || !payload.audio) return;
        const decoded = decodePCM(pending, Uint8Array.from(atob(payload.audio), (c) => c.charCodeAt(0)));
        pending = new Uint8Array(decoded.pending);
        if (!decoded.samples.length) return;
        samplesPlayed += decoded.samples.length;
        const buffer = context.createBuffer(1, decoded.samples.length, 24000);
        buffer.copyToChannel(decoded.samples, 0);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        sources.add(source);
        last = new Promise<void>((resolve) => {
          source.onended = () => { sources.delete(source); resolve(); };
        });
        playhead = Math.max(playhead, context.currentTime + 0.05);
        source.start(playhead);
        playhead += buffer.duration;
        if (!started) { started = true; onStart?.(); }
      },
    });
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    try {
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        parser.feed(next.value);
      }
      parser.reset({ consume: true });
    } finally {
      reader.releaseLock();
    }
    if (!completed || !samplesPlayed) throw new Error("Incomplete speech stream");
    await last;
    signal.throwIfAborted();
  } finally {
    signal.removeEventListener("abort", stopAll);
    stopAll();
    await context.close().catch(() => {});
  }
}
