"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "./gsap";
import { FloralMark } from "@/components/brand/FloralMark";
import { Wordmark } from "@/components/brand/Wordmark";

const KEY = "dms-intro-seen";

export function Loader() {
  const [active, setActive] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(true);
      document.documentElement.style.overflow = "hidden";
    }
  }, []);

  useGSAP(
    () => {
      if (!active || !root.current) return;
      const done = () => {
        sessionStorage.setItem(KEY, "1");
        document.documentElement.style.overflow = "";
        setActive(false);
      };

      if (prefersReducedMotion()) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.4, onComplete: done });
        return;
      }

      const paths = root.current.querySelectorAll<SVGElement>("path, circle");
      const tl = gsap.timeline({ onComplete: done });
      tl.fromTo(
        paths,
        { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.03, ease: "power3.out" },
      )
        .to(
          ".loader-sheen",
          { xPercent: 220, duration: 0.6, ease: "power2.inOut" },
          "-=0.3",
        )
        .fromTo(
          ".loader-wordmark",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2",
        )
        .to(".loader-mark, .loader-wordmark", {
          opacity: 0,
          y: -10,
          duration: 0.4,
          delay: 0.25,
        })
        .to(root.current, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.1");
    },
    { dependencies: [active], scope: root },
  );

  if (!active) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-ink"
      aria-hidden
    >
      <div className="loader-mark relative overflow-hidden">
        <FloralMark outline className="h-24 w-24 text-ivory" />
        <span className="loader-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>
      <div className="loader-wordmark opacity-0">
        <Wordmark showMark={false} className="text-ivory" />
      </div>
    </div>
  );
}
