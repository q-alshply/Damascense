"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="border border-line px-3 py-1.5 text-xs uppercase tracking-[0.12em] hover:bg-ivory/5"
    >
      {done ? "Copied" : label}
    </button>
  );
}
