"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact({ name }: { name: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      gsap.set(q(".ct-poly"), {
        opacity: 0,
        scale: 0.4,
        transformOrigin: "center center",
      });
      gsap.set(q(".ct-note"), {
        opacity: 0,
        y: 40,
        rotate: 8,
        scale: 0.85,
      });
      gsap.set(q(".ct-title-word"), {
        opacity: 0,
        yPercent: 140,
        rotate: (i) => (i % 2 === 0 ? -6 : 6),
      });
      gsap.set(q(".ct-title-wrap"), {
        opacity: 0,
        scale: 0,
        rotate: -20,
        transformOrigin: "left center",
      });
      gsap.set(q(".ct-item"), { opacity: 0, x: -50 });
      gsap.set(q(".ct-item-icon"), { scale: 0, rotate: -180 });
      gsap.set(q(".ct-btn"), {
        opacity: 0,
        scale: 0,
        rotate: -30,
        transformOrigin: "center center",
      });
      gsap.set(q(".ct-footer span"), { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      tl.to(q(".ct-poly"), {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.6)",
      })
        .to(
          q(".ct-note"),
          {
            opacity: 1,
            y: 0,
            rotate: -2,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        )
        .to(
          q(".ct-title-word"),
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: "back.out(1.8)",
          },
          "-=0.6"
        )
        .to(
          q(".ct-title-wrap"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(2.2)",
          },
          ">-0.25"
        )
        .to(
          q(".ct-item"),
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          q(".ct-item-icon"),
          {
            scale: 1,
            rotate: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: "back.out(2.4)",
          },
          "<0.15"
        )
        .to(
          q(".ct-btn"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(2)",
          },
          "-=0.3"
        )
        .to(
          q(".ct-footer span"),
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: "var(--paper-2)",
        maxWidth: "none",
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="grid-split"
        style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}
      >
        <div>
          <div style={{ position: "relative", height: 480 }}>
            <svg
              viewBox="0 0 400 400"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <polygon
                className="ct-poly"
                points="20,60 380,60 380,340 20,340"
                fill="#f4b5be"
                stroke="#d7263d"
                strokeWidth="1.5"
              />
              <polygon
                className="ct-poly"
                points="20,60 200,220 380,60"
                fill="#f4b5be"
                stroke="#d7263d"
                strokeWidth="1.5"
              />
              <polygon
                className="ct-poly"
                points="20,340 180,200 220,200 380,340"
                fill="#d7263d"
                opacity="0.25"
              />
            </svg>

            <div
              className="ct-note"
              style={{
                position: "absolute",
                top: 90,
                left: "10%",
                width: "80%",
                background: "var(--card)",
                padding: "24px 26px",
                boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
                fontFamily: "var(--font-caveat), 'Caveat', cursive",
                fontSize: 22,
                lineHeight: 1.5,
                color: "#1a1a1a",
                backgroundImage:
                  "repeating-linear-gradient(transparent 0 31px, rgba(0,0,0,0.08) 31px 32px)",
                paddingTop: 16,
              }}
            >
              thank you so much for taking the time
              <br />
              to look through my portfolio.
              <br />
              always appreciate new opportunities
              <br />
              to learn and grow.
              <br />
              <br />
              if you&rsquo;re interested in working together,
              <br />
              i&rsquo;d love to chat.
            </div>
          </div>
        </div>

        <div style={{ paddingLeft: 0 }}>
          <h2
            className="contact-big"
            style={{
              fontSize: "clamp(60px, 10vw, 160px)",
              fontWeight: 800,
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              marginBottom: 40,
            }}
          >
            <span
              className="ct-title-word"
              style={{ display: "inline-block", paddingBottom: "0.05em" }}
            >
              and
            </span>
            <br />
            <span
              className="ct-title-word"
              style={{ display: "inline-block", paddingBottom: "0.05em" }}
            >
              that&rsquo;s
            </span>
            <br />
            <span
              className="ct-title-wrap"
              style={{
                display: "inline-block",
                color: "var(--accent)",
                paddingBottom: "0.05em",
              }}
            >
              a wrap.
            </span>
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginTop: 40,
            }}
          >
            {[
              { icon: "✉", label: "ilham_lam@icloud.com" },
              { icon: "◎", label: "@ilhmhmmd" },
              { icon: "▶", label: "youtube.com/@ilham" },
            ].map((s) => (
              <div
                key={s.label}
                className="ct-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily:
                    "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  fontSize: 14,
                }}
              >
                <span
                  className="ct-item-icon"
                  style={{
                    width: 32,
                    height: 32,
                    background: "var(--accent)",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 60 }}>
            <button className="rough-btn ct-btn">
              let&rsquo;s work together →
            </button>
          </div>
        </div>
      </div>

      <div
        className="hide-mobile ct-footer"
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 7vw",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <span>made with ♥ + caffeine</span>
        <span>v.12.12.24 / home</span>
      </div>
    </section>
  );
}
