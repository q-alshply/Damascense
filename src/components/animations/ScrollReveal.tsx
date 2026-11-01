"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "./gsap";
import { cn } from "@/lib/utils";

type As = "div" | "section" | "span" | "li" | "figure" | "header";

/**
 * Restrained entrance. Children with `data-reveal` animate in on scroll;
 * otherwise the wrapper itself does. Reduced motion → plain opacity.
 */
export function ScrollReveal({
  children,
  as = "div",
  className,
  y = 24,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  as?: As;
  className?: string;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as React.ElementType;

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = ref.current.querySelectorAll("[data-reveal]");
      const items = targets.length ? targets : [ref.current];
      const reduce = prefersReducedMotion();

      gsap.fromTo(
        items,
        { autoAlpha: 0, y: reduce ? 0 : y },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduce ? 0.3 : 0.9,
          ease: "power3.out",
          stagger: reduce ? 0 : stagger,
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
