"use client";

import { useActionState, useTransition } from "react";
import {
  uploadProductImages,
  setCoverImage,
  deleteProductImage,
  updateImageAlt,
  reorderProductImages,
} from "@/lib/admin/actions";
import { publicImageUrl } from "@/lib/queries/media";
import { Banner, Card, Label, field } from "./ui";
import type { ProductImageRow } from "@/lib/supabase/types";

export function ProductImages({
  productId,
  images,
}: {
  productId: string;
  images: ProductImageRow[];
}) {
  const [state, formAction] = useActionState(uploadProductImages, {});
  const [, startTransition] = useTransition();
  const ordered = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const move = (index: number, dir: -1 | 1) => {
    const next = [...ordered];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    startTransition(() =>
      reorderProductImages(
        productId,
        next.map((i) => i.id),
      ),
    );
  };

  return (
    <Card>
      <h2 className="text-sm uppercase tracking-[0.14em] text-ivory/45">Images</h2>

      <form action={formAction} className="mt-4 flex flex-wrap items-center gap-3">
        <input type="hidden" name="product_id" value={productId} />
        <input
          type="file"
          name="files"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="text-sm text-ivory/60 file:me-3 file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:uppercase file:text-ivory"
        />
        <button className="border border-line px-4 py-2 text-xs uppercase tracking-[0.12em] hover:bg-ivory/5">
          Upload
        </button>
      </form>
      {state.error && <Banner kind="error">{state.error}</Banner>}
      {state.ok && <Banner kind="success">{state.message}</Banner>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {ordered.map((img, i) => {
          const url = publicImageUrl(img.storage_path);
          return (
            <div key={img.id} className="border border-line p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url ?? ""} alt={img.alt_en ?? ""} className="h-40 w-full object-cover" />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={img.is_cover ? "text-accent-soft" : "text-ivory/40"}>
                  {img.is_cover ? "Cover" : `#${i + 1}`}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => move(i, -1)} className="hover:text-ivory">↑</button>
                  <button onClick={() => move(i, 1)} className="hover:text-ivory">↓</button>
                  {!img.is_cover && (
                    <form action={setCoverImage}>
                      <input type="hidden" name="product_id" value={productId} />
                      <input type="hidden" name="image_id" value={img.id} />
                      <button className="hover:text-ivory">set cover</button>
                    </form>
                  )}
                  <form action={deleteProductImage}>
                    <input type="hidden" name="product_id" value={productId} />
                    <input type="hidden" name="image_id" value={img.id} />
                    <button className="text-[#d98b7a] hover:underline">delete</button>
                  </form>
                </div>
              </div>
              <form action={updateImageAlt} className="mt-2 space-y-1">
                <input type="hidden" name="product_id" value={productId} />
                <input type="hidden" name="image_id" value={img.id} />
                <Label>Alt text</Label>
                <input name="alt_en" defaultValue={img.alt_en ?? ""} placeholder="Alt EN" className={field} />
                <input name="alt_ar" dir="rtl" defaultValue={img.alt_ar ?? ""} placeholder="Alt AR" className={field} />
                <button className="text-xs text-ivory/45 hover:text-ivory">save alt</button>
              </form>
            </div>
          );
        })}
        {ordered.length === 0 && (
          <p className="text-sm text-ivory/40">No images yet.</p>
        )}
      </div>
    </Card>
  );
}
