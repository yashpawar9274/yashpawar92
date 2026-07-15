import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Upload, RotateCcw } from "lucide-react";

const STORAGE_PREFIX = "yp-portfolio:img:";

function readStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(STORAGE_PREFIX + key);
    else window.localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    // ignore quota errors
  }
}

export function useEditableImage(storageKey: string, fallback: string) {
  const [src, setSrc] = useState<string>(fallback);

  useEffect(() => {
    const stored = readStored(storageKey);
    if (stored) setSrc(stored);
  }, [storageKey]);

  const upload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setSrc(url);
      writeStored(storageKey, url);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setSrc(fallback);
    writeStored(storageKey, null);
  };

  return { src, upload, reset };
}

interface EditableImageProps {
  storageKey: string;
  fallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  aspect?: string;
  label?: string;
}

export function EditableImage({
  storageKey,
  fallback,
  alt,
  className = "",
  imgClassName = "h-full w-full object-cover",
  style,
  aspect,
  label,
}: EditableImageProps) {
  const { src, upload, reset } = useEditableImage(storageKey, fallback);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustom = src !== fallback;

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <img src={src} alt={alt} className={imgClassName} />

      {/* Hover overlay controls */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur transition-transform hover:scale-[1.03]"
          >
            <Upload className="h-3.5 w-3.5" />
            {label ?? "Upload"}
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-ink/90"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
