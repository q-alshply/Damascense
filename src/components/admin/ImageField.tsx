"use client";

import { useState } from "react";
import { Label, field } from "./ui";

/** URL-based image field with live preview. Paste a Supabase Storage public
 *  URL, a /media URL, or any absolute image URL. */
export function ImageField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://…"
        className={field}
      />
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-32 w-full max-w-xs border border-line object-cover"
        />
      ) : null}
    </div>
  );
}
