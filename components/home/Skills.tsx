"use client";

import Image from "next/image";
import { CSSProperties } from "react";
import { Reveal } from "./Primitives";

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

  return (
    <section
      className="section"
      style={{ position: "relative", paddingTop: 80, paddingBottom: 80 }}
    >
      <Reveal>
        <div className="section-label" style={{ marginBottom: 30 }}>
          04 · skills + works
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="skills-grid-wrap" style={{ position: "relative", marginTop: 40 }}>
          <div className="skills-title" aria-hidden>
            skills
            <br />
            &amp; works
          </div>
        <div
          className="skills-grid"
          style={{ position: "relative", zIndex: 1 }}
        >
          {items.map((it, i) => (
            <div key={i} style={it.style}>
              {(it.type === "photo" || it.type === "video") && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: `rotate(${it.rot}deg)`,
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
                  {["#0f0f0f", "var(--accent)", "#f2ede4", "#6b6b66", "#8a1828", "#e4ddcc"].map(
                    (c, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: c,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      />
                    )
                  )}
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
                    style={{
                      fontFamily:
                        "var(--font-climate-crisis), 'Climate Crisis', sans-serif",
                      fontSize: 64,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-instrument-serif), 'Instrument Serif', serif",
                      fontSize: 64,
                      color: "#0f0f0f",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                      fontSize: 64,
                      fontWeight: 700,
                      color: "#0f0f0f",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </Reveal>

      <Reveal delay={300}>
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
            className="font-mono"
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
          <button className="sticky-btn" type="button">
            portfolio
          </button>
          <div
            className="font-mono"
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
      </Reveal>
    </section>
  );
}
