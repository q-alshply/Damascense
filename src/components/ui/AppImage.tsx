import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper with a warm placeholder tone and sane defaults.
 * `fill` layout is expected — parent must be positioned.
 */
export function AppImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
}: {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-ink-700", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-ivory/20">
          <span className="text-xs uppercase tracking-[0.2em]">Image</span>
        </div>
      )}
    </div>
  );
}
