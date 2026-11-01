"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion } from "./gsap";

/**
 * Desktop-only pointer. A small dot that grows into a labelled disc over
 * elements marked `data-cursor="view" | "explore"`. Never shown on touch.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const t = useTranslations("cursor");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-custom-cursor");
    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.25, ease: "power3" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.25, ease: "power3" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const el = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      const kind = el?.dataset.cursor;
      setLabel(kind === "explore" ? t("explore") : kind === "view" ? t("view") : null);
    };
    const leave = () => gsap.to(dot.current, { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to(dot.current, { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [t]);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[150] -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-difference"
    >
      <div
        className={
          "flex items-center justify-center rounded-full border border-ivory text-[10px] uppercase tracking-[0.2em] text-ivory transition-all duration-300 " +
          (label ? "h-16 w-16 bg-ivory/5" : "h-2.5 w-2.5")
        }
      >
        {label}
      </div>
    </div>
  );
}
