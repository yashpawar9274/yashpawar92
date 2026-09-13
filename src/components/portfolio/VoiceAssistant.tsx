import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { Mic, Square, X, Loader2, Sparkles, Volume2, Send } from "lucide-react";
import { assistantAsk, assistantSpeak, assistantTranscribe } from "@/lib/assistant.functions";
import type { SiteContent } from "@/lib/content-defaults";

type Msg = { role: "user" | "assistant"; content: string };

function pickMime() {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return "";
}

export function VoiceAssistant({ config, name }: { config: SiteContent["assistant"]; name: string }) {
  const ask = useServerFn(assistantAsk);
  const speak = useServerFn(assistantSpeak);
  const transcribe = useServerFn(assistantTranscribe);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<"idle" | "recording" | "thinking" | "speaking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [typed, setTyped] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!open || greetedRef.current) return;
    greetedRef.current = true;
    setMessages([{ role: "assistant", content: config.greeting }]);
    void play(config.greeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  async function play(text: string) {
    try {
      setStatus("speaking");
      const { audio } = await speak({ data: { text: text.slice(0, 1200), instructions: config.voiceInstructions } });
      stopAudio();
      const el = new Audio(audio);
      audioRef.current = el;
      el.onended = () => setStatus("idle");
      await el.play();
    } catch {
      setStatus("idle");
    }
  }

  async function send(question: string) {
    const q = question.trim();
    if (!q) return;
    stopAudio();
    setError(null);
    const history = [...messages, { role: "user" as const, content: q }];
    setMessages(history);
    setStatus("thinking");
    try {
      const { reply } = await ask({ data: { messages: history.slice(-12).map((m) => ({ role: m.role, content: m.content })) } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      await play(reply);
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  async function startRecording() {
    setError(null);
    stopAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        if (blob.size < 2000) {
          setStatus("idle");
          setError("That recording was too short — please hold the mic and speak again.");
          return;
        }
        setStatus("thinking");
        try {
          const dataUrl: string = await new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(String(fr.result));
            fr.onerror = () => rej(new Error("Could not read the recording."));
            fr.readAsDataURL(blob);
          });
          const { text } = await transcribe({ data: { audio: dataUrl, mimeType: type.split(";")[0]! } });
          if (!text) {
            setStatus("idle");
            setError("I couldn't hear that clearly — please try again.");
            return;
          }
          await send(text);
        } catch (e) {
          setStatus("idle");
          setError(e instanceof Error ? e.message : "Could not process the recording.");
        }
      };
      recorderRef.current = rec;
      rec.start();
      setStatus("recording");
    } catch {
      setError("Microphone access is needed to talk. You can also type your question below.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  if (!config.enabled) return null;

  const busy = status === "thinking";

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-transform hover:scale-[1.04]"
        aria-label={config.buttonLabel}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-blue/40" />
          <Sparkles className="relative h-4 w-4 text-blue-glow" />
        </span>
        <span className="hidden sm:inline">{config.buttonLabel}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 right-4 left-4 z-[70] flex max-h-[80vh] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-[var(--shadow-card)] sm:left-auto sm:w-[26rem]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border bg-secondary/50 px-5 py-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="h-4 w-4 text-blue" /> {config.title}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{config.subtitle}</p>
              </div>
              <button
                onClick={() => { stopAudio(); stopRecording(); setStatus("idle"); setOpen(false); }}
                aria-label="Close assistant"
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-ink text-primary-foreground"
                      : "border border-border bg-secondary/40 text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              )}
              {status === "speaking" && (
                <div className="flex items-center gap-2 text-xs text-blue">
                  <Volume2 className="h-3.5 w-3.5" /> Speaking… <button onClick={() => { stopAudio(); setStatus("idle"); }} className="underline">stop</button>
                </div>
              )}
              {error && <p className="text-xs text-red-600">{error}</p>}

              {messages.length <= 1 && !busy && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {config.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (status === "recording" ? stopRecording() : void startRecording())}
                  disabled={busy}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                    status === "recording" ? "bg-red-600 text-white" : "bg-blue text-white hover:bg-blue/90"
                  }`}
                >
                  {status === "recording" ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {status === "recording" ? "Stop & send" : "Talk"}
                </button>
                <form
                  onSubmit={(e) => { e.preventDefault(); const q = typed; setTyped(""); void send(q); }}
                  className="flex flex-1 items-center gap-2"
                >
                  <input
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder="Or type a question"
                    className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground"
                  />
                  <button disabled={busy || !typed.trim()} aria-label="Send question" className="rounded-full border border-border p-2.5 text-muted-foreground hover:bg-secondary disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                AI voice assistant · answers only from {name}'s portfolio details.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
