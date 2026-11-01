"use client";

import Image from "next/image";
import type { ProductImage } from "@/lib/queries/types";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  if (!images.length)
    return <div className="aspect-[4/5] w-full bg-ink-700" />;

  return (
    <div className="flex flex-col gap-4">
      {images.map((img, i) => (
        <div key={img.id} className="relative aspect-[4/5] w-full overflow-hidden bg-ink-700">
          <Image
            src={img.url}
            alt={img.alt_en ?? `${name} — ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
