import { cn } from "@/lib/utils";
import { FloralMark } from "./FloralMark";

/**
 * Brand lockup. If `public/brand/damascense.svg` is supplied it will be used
 * via the <img> fallback path; until then this is a typographic stand-in that
 * matches the logo's character (high-contrast serif + floral mark).
 */
export function Wordmark({
  className,
  showMark = true,
  stacked = false,
}: {
  className?: string;
  showMark?: boolean;
  stacked?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 leading-none",
        stacked && "flex-col gap-2",
        className,
      )}
      aria-label="Damascense Studio"
    >
      {showMark && (
        <FloralMark className="h-[1.4em] w-[1.4em] text-accent" aria-hidden />
      )}
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.5em] tracking-[0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Damascense
        </span>
        <span className="mt-1 text-[0.5em] uppercase tracking-[0.42em] text-ivory/70">
          Studio
        </span>
      </span>
    </span>
  );
}
