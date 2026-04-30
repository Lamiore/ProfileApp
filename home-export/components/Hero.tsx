"use client";

import { CSSProperties, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SparklesOverlay } from "@/components/ui/sparkles-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SPARKLE_COLORS = { first: "#f2ede4", second: "#d7263d" };

export default function Hero({ name, role }: { name: string; role: string }) {
  const parts = name.trim().split(/\s+/);
  const first = (parts[0] || name).toUpperCase();
  const last = (parts.slice(1).join(" ") || "").toUpperCase();
  const longest = Math.max(first.length, last.length || 1);
  const vw = Math.min(16, Math.max(6, 72 / longest));

  const common: CSSProperties = {
    fontFamily:
      "var(--font-climate-crisis), 'Climate Crisis', 'Rubik Mono One', sans-serif",
    fontSize: `clamp(40px, ${vw}vw, 180px)`,
    color: "var(--accent)",
    lineHeight: 0.82,
    margin: 0,
    textAlign: "center",
    letterSpacing: "-0.05em",
    fontWeight: 400,
    whiteSpace: "nowrap",
    textShadow: "0.06em 0.07em 0 var(--ink)",
    position: "relative",
  };

  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);

      // ── initial state ─────────────────────────────────────────
      gsap.set(q(".hero-gsap-hi"), { opacity: 0, x: -40, rotate: -14 });
      gsap.set(q(".hero-gsap-menu"), { opacity: 0, x: 60, rotate: -40 });
      gsap.set(q(".hero-gsap-first-char"), {
        yPercent: 130,
        opacity: 0,
        rotate: (i) => (i % 2 === 0 ? -12 : 8),
      });
      gsap.set(q(".hero-gsap-last-char"), {
        yPercent: -130,
        opacity: 0,
        rotate: (i) => (i % 2 === 0 ? 10 : -10),
      });
      gsap.set(q(".hero-gsap-this-is"), {
        opacity: 0,
        scale: 0,
        rotate: 40,
        transformOrigin: "center center",
      });
      gsap.set(q(".hero-gsap-portrait"), {
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        scale: 1.04,
      });
      gsap.set(q(".hero-gsap-mono"), { opacity: 0, y: 18 });
      gsap.set(q(".hero-gsap-scroll"), { opacity: 0, y: 8 });
      gsap.set(q(".hero-gsap-sparkles"), { opacity: 0 });

      // ── entrance timeline ─────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(
        q(".hero-gsap-hi"),
        { opacity: 1, x: 0, rotate: -2, duration: 0.9, ease: "back.out(1.4)" },
        0.2
      )
        .to(
          q(".hero-gsap-menu"),
          {
            opacity: 1,
            x: 0,
            rotate: -18,
            duration: 1.0,
            ease: "back.out(1.6)",
          },
          0.35
        )
        .to(
          q(".hero-gsap-first-char"),
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.1,
            stagger: 0.055,
            ease: "back.out(1.9)",
          },
          0.55
        )
        .to(
          q(".hero-gsap-this-is"),
          {
            opacity: 1,
            scale: 1,
            rotate: -4,
            duration: 0.85,
            ease: "back.out(2)",
          },
          0.85
        )
        .to(
          q(".hero-gsap-last-char"),
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.1,
            stagger: { each: 0.055, from: "end" },
            ease: "back.out(1.9)",
          },
          0.95
        )
        .to(
          q(".hero-gsap-portrait"),
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          1.35
        )
        .to(
          q(".hero-gsap-mono"),
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
          },
          1.8
        )
        .to(
          q(".hero-gsap-scroll"),
          { opacity: 1, y: 0, duration: 0.6 },
          2.15
        )
        .to(
          q(".hero-gsap-sparkles"),
          { opacity: 1, duration: 0.9, ease: "power2.out" },
          2.5
        );

      // ── ambient loops (starts after entrance) ─────────────────
      gsap.to(q(".hero-gsap-hi"), {
        rotate: -4,
        y: -3,
        duration: 3.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2.6,
      });
      gsap.to(q(".hero-gsap-menu"), {
        rotate: -20,
        y: 3,
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2.8,
      });
      gsap.to(q(".hero-gsap-this-is"), {
        rotate: -2,
        y: -6,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2.4,
      });

      // ── mouse parallax on portrait ────────────────────────────
      const portrait = q(".hero-gsap-portrait")[0] as HTMLElement | undefined;
      const quickX = portrait
        ? gsap.quickTo(portrait, "x", { duration: 0.9, ease: "power3.out" })
        : null;
      const quickY = portrait
        ? gsap.quickTo(portrait, "y", { duration: 0.9, ease: "power3.out" })
        : null;

      const onMove = (e: MouseEvent) => {
        if (!quickX || !quickY) return;
        const dx = (e.clientX / window.innerWidth - 0.5) * 18;
        const dy = (e.clientY / window.innerHeight - 0.5) * 12;
        quickX(dx);
        quickY(dy);
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      // ── scroll parallax on background heading ──────────────────
      // text moves slower than scroll → adds depth behind the portrait.
      const bgText = q(".hero-gsap-bg-text")[0] as HTMLElement | undefined;
      if (bgText) {
        gsap.to(bgText, {
          yPercent: 35,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      // mouse parallax on bg heading — opposite direction of portrait
      // so it feels layered/deeper.
      const quickBgX = bgText
        ? gsap.quickTo(bgText, "x", { duration: 1.1, ease: "power3.out" })
        : null;
      const quickBgY = bgText
        ? gsap.quickTo(bgText, "y", { duration: 1.1, ease: "power3.out" })
        : null;
      const onMoveBg = (e: MouseEvent) => {
        if (!quickBgX || !quickBgY) return;
        const dx = (e.clientX / window.innerWidth - 0.5) * -10;
        const dy = (e.clientY / window.innerHeight - 0.5) * -6;
        quickBgX(dx);
        quickBgY(dy);
      };
      window.addEventListener("mousemove", onMoveBg, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mousemove", onMoveBg);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const splitChars = (s: string, className: string) =>
    s.split("").map((c, i) => (
      <span
        key={i}
        className={className}
        style={{ display: "inline-block", whiteSpace: "pre" }}
      >
        {c === " " ? " " : c}
      </span>
    ));

  return (
    <section
      ref={rootRef}
      className="section"
      style={{
        minHeight: "100vh",
        paddingTop: 60,
        paddingBottom: 80,
        position: "relative",
      }}
    >
      <div
        className="hero-script hero-gsap-hi"
        style={{
          position: "absolute",
          top: 80,
          left: "7vw",
          zIndex: 5,
        }}
      >
        <div
          className="font-hand"
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontWeight: 600,
            fontSize: 44,
            lineHeight: 1,
          }}
        >
          hi. since you&rsquo;re new here,
        </div>
      </div>

      <div
        className="hero-script-sm hide-mobile hero-gsap-menu"
        style={{
          position: "absolute",
          top: 100,
          right: "7vw",
          zIndex: 5,
          textAlign: "right",
          transformOrigin: "right center",
        }}
      >
        <div
          className="font-hand"
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontWeight: 600,
            fontSize: 32,
            lineHeight: 1,
            color: "var(--ink-2)",
            whiteSpace: "nowrap",
          }}
        >
          click here for menu →
        </div>
      </div>

      <div
        className="hero-gsap-bg-text"
        style={{
          position: "absolute",
          top: "18%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <h1
          className="font-display"
          style={{
            ...common,
            alignSelf: "flex-start",
            marginLeft: "6vw",
            paddingBottom: "0.1em",
          }}
        >
          <SparklesOverlay
            className="hero-gsap-sparkles"
            colors={SPARKLE_COLORS}
            sparklesCount={14}
          />
          {splitChars(first, "hero-gsap-first-char")}
        </h1>
        {last && (
          <h1
            className="font-display"
            style={{
              ...common,
              alignSelf: "flex-end",
              marginRight: "calc(4vw - 0.12em)",
              marginTop: "-0.08em",
              overflow: "hidden",
              paddingRight: "0.12em",
              paddingBottom: "0.12em",
            }}
          >
            <SparklesOverlay
              className="hero-gsap-sparkles"
              colors={SPARKLE_COLORS}
              sparklesCount={14}
            />
            {splitChars(last, "hero-gsap-last-char")}
          </h1>
        )}
      </div>

      <div
        className="font-hand hero-gsap-this-is"
        style={{
          position: "absolute",
          top: "14%",
          left: "20vw",
          fontFamily: "var(--font-caveat), cursive",
          fontWeight: 600,
          fontSize: 48,
          zIndex: 3,
          color: "var(--ink)",
        }}
      >
        this is
      </div>

      {/* bottom fade — biar foto lebur ke Origin, ga kepotong tajam */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: "100vw",
          height: "40vh",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0) 0%, rgba(13,13,13,0.35) 30%, rgba(13,13,13,0.85) 70%, #0d0d0d 100%)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* portrait — nempel di dasar section Hero, gede */}
      <div
        className="hero-gsap-portrait"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        <div
          className="hero-portrait"
          style={{
            flexShrink: 0,
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          <Image
            src="/image/home/Gueh.png"
            alt={`portrait of ${name}`}
            width={1427}
            height={1340}
            priority
            sizes="(max-width: 480px) 640px, (max-width: 768px) 780px, 980px"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              filter: "grayscale(100%) contrast(1.08)",
            }}
          />
        </div>
      </div>

      <div
        className="hero-gsap-mono"
        style={{
          position: "absolute",
          bottom: 40,
          left: "7vw",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {role}
        </div>
      </div>

      <div
        className="hide-mobile hero-gsap-mono"
        style={{
          position: "absolute",
          bottom: 40,
          right: "7vw",
          zIndex: 5,
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          by {name} · {new Date().getFullYear()}
        </div>
      </div>

      <div
        className="hero-gsap-scroll"
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          fontFamily: "var(--font-caveat), cursive",
          fontSize: 22,
          color: "var(--muted)",
        }}
      >
        scroll <span className="hero-scroll-arrow">↓</span>
      </div>
    </section>
  );
}
