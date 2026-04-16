"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FillTextProps {
  children: string;
  className?: string;
}

export default function FillText({ children, className }: FillTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(el, {
      backgroundSize: "200% 200%",
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top 80%",
        end: "bottom 35%",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <p
      className={className}
      style={{
        margin: 0,
        fontSize: "clamp(22px, 4vw, 48px)",
        fontWeight: 600,
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
        fontFamily: "'Syne', system-ui, sans-serif",
      }}
    >
      <span
        ref={spanRef}
        style={{
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundColor: "#3f434a",
          backgroundImage: "linear-gradient(135deg, #f3f4f6 50%, #3f434a 60%)",
          backgroundPosition: "0 0",
          backgroundRepeat: "no-repeat",
          backgroundSize: "0% 200%",
          color: "transparent",
          display: "inline",
          willChange: "background-size",
        }}
      >
        {children}
      </span>
    </p>
  );
}
