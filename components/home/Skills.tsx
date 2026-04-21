"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Item =
  | {
      type: "photo" | "video";
      src: string;
      label: string;
      rot: number;
      style: CSSProperties;
    }
  | { type: "swatch" | "type"; style: CSSProperties };

export default function Skills() {
  const items: Item[] = [
    {
      type: "video",
      src: "/image/home/skills/edit1.mp4",
      label: "sketch 01",
      rot: -4,
      style: { gridColumn: "1 / 3", gridRow: "1 / 3" },
    },
    {
      type: "photo",
      src: "/image/home/skills/editrig.png",
      label: "edit rig",
      rot: 3,
      style: { gridColumn: "3 / 4", gridRow: "1 / 2" },
    },
    { type: "swatch", style: { gridColumn: "4 / 6", gridRow: "1 / 2" } },
    {
      type: "photo",
      src: "/image/home/skills/draw.jpeg",
      label: "site snap",
      rot: -2,
      style: { gridColumn: "6 / 7", gridRow: "1 / 3" },
    },
    {
      type: "photo",
      src: "/image/home/skills/flower.jpg",
      label: "food",
      rot: 4,
      style: { gridColumn: "7 / 8", gridRow: "1 / 2" },
    },
    {
      type: "photo",
      src: "/image/home/skills/mockup.jpg",
      label: "mockup",
      rot: -3,
      style: { gridColumn: "3 / 5", gridRow: "2 / 3" },
    },
    { type: "type", style: { gridColumn: "5 / 7", gridRow: "2 / 3" } },
    {
      type: "video",
      src: "/image/home/skills/edit2.mp4",
      label: "client 01",
      rot: 2,
      style: { gridColumn: "7 / 8", gridRow: "2 / 3" },
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      gsap.set(q(".sk-label"), { opacity: 0, x: -50 });
      gsap.set(q(".sk-title-line"), {
        opacity: 0,
        yPercent: 120,
        rotate: (i) => (i === 0 ? -8 : 8),
      });
      gsap.set(q(".sk-swatch-cell"), {
        opacity: 0,
        scale: 0,
        rotate: (i) => (i % 2 === 0 ? -20 : 20),
      });
      gsap.set(q(".sk-type-letter"), {
        opacity: 0,
        yPercent: -120,
        rotate: (i) => (i === 0 ? -15 : i === 1 ? 10 : -8),
      });
      gsap.set(q(".sk-caption"), { opacity: 0, y: 20 });
      gsap.set(q(".sk-btn"), {
        opacity: 0,
        scale: 0,
        rotate: -20,
        transformOrigin: "center center",
      });

      const cells = q(".sk-cell");
      cells.forEach((cell) => {
        const rot = parseFloat(cell.getAttribute("data-rot") || "0");
        gsap.set(cell, {
          opacity: 0,
          y: 80,
          scale: 0.6,
          rotateX: 60,
          rotate: rot + (rot > 0 ? 20 : -20),
          transformPerspective: 800,
          transformOrigin: "center bottom",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.to(q(".sk-label"), {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .to(
          q(".sk-title-line"),
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            stagger: 0.18,
            ease: "back.out(1.7)",
          },
          "-=0.35"
        )
        .to(
          cells,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotate: (i, el) => parseFloat(el.getAttribute("data-rot") || "0"),
            duration: 0.9,
            stagger: { each: 0.08, from: "random" },
            ease: "back.out(1.4)",
          },
          "-=0.6"
        )
        .to(
          q(".sk-swatch-cell"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          "<0.1"
        )
        .to(
          q(".sk-type-letter"),
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(2)",
          },
          "<0.2"
        )
        .to(
          q(".sk-caption"),
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          ">-0.3"
        )
        .to(
          q(".sk-btn"),
          {
            opacity: 1,
            scale: 1,
            rotate: 3,
            duration: 0.7,
            ease: "back.out(2.2)",
          },
          "<0.1"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ position: "relative", paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="section-label sk-label" style={{ marginBottom: 30 }}>
        04 · skills + works
      </div>

      <div className="skills-grid-wrap" style={{ position: "relative", marginTop: 40 }}>
        <div className="skills-title" aria-hidden>
          <span className="sk-title-line" style={{ display: "inline-block" }}>
            skills
          </span>
          <br />
          <span className="sk-title-line" style={{ display: "inline-block" }}>
            &amp; works
          </span>
        </div>
        <div
          className="skills-grid"
          style={{ position: "relative", zIndex: 1 }}
        >
          {items.map((it, i) => {
            const isMedia = it.type === "photo" || it.type === "video";
            const rot = isMedia ? it.rot : 0;
            return (
              <div
                key={i}
                className="sk-cell"
                data-rot={rot}
                style={{ ...it.style, position: "relative" }}
              >
                {isMedia && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow:
                        "0 2px 4px rgba(0,0,0,0.18), 0 10px 24px rgba(0,0,0,0.35)",
                      background: "#1a1a1a",
                    }}
                  >
                    {it.type === "photo" ? (
                      <Image
                        src={it.src}
                        alt={it.label}
                        fill
                        sizes="(max-width: 900px) 50vw, 20vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <video
                        src={it.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                )}
                {it.type === "swatch" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "var(--card)",
                      border: "1px solid var(--ink)",
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: 6,
                      padding: 10,
                    }}
                  >
                    {[
                      "#0f0f0f",
                      "var(--accent)",
                      "#f2ede4",
                      "#6b6b66",
                      "#8a1828",
                      "#e4ddcc",
                    ].map((c, idx) => (
                      <div
                        key={idx}
                        className="sk-swatch-cell"
                        style={{
                          background: c,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      />
                    ))}
                  </div>
                )}
                {it.type === "type" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "var(--card)",
                      border: "1px solid var(--ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      padding: 10,
                    }}
                  >
                    <div
                      className="sk-type-letter"
                      style={{
                        fontFamily:
                          "var(--font-climate-crisis), 'Climate Crisis', sans-serif",
                        fontSize: 64,
                        color: "var(--accent)",
                        lineHeight: 1,
                        display: "inline-block",
                      }}
                    >
                      Aa
                    </div>
                    <div
                      className="sk-type-letter"
                      style={{
                        fontFamily:
                          "var(--font-instrument-serif), 'Instrument Serif', serif",
                        fontSize: 64,
                        color: "#0f0f0f",
                        lineHeight: 1,
                        display: "inline-block",
                      }}
                    >
                      Aa
                    </div>
                    <div
                      className="sk-type-letter"
                      style={{
                        fontFamily:
                          "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        fontSize: 64,
                        fontWeight: 700,
                        color: "#0f0f0f",
                        lineHeight: 1,
                        display: "inline-block",
                      }}
                    >
                      Aa
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="mobile-stack"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 50,
          gap: 30,
        }}
      >
        <div
          className="font-mono sk-caption"
          style={{
            fontSize: 12,
            maxWidth: 240,
            lineHeight: 1.6,
            color: "var(--ink-2)",
          }}
        >
          <b>graphic design:</b>
          <br />
          posters, illustration, logos, etc.
        </div>
        <button className="sticky-btn sk-btn" type="button">
          portfolio
        </button>
        <div
          className="font-mono sk-caption"
          style={{
            fontSize: 12,
            maxWidth: 240,
            lineHeight: 1.6,
            color: "var(--ink-2)",
          }}
        >
          <b>video editing:</b>
          <br />
          shorts, reels, long-form, motion graphics.
        </div>
      </div>
    </section>
  );
}
