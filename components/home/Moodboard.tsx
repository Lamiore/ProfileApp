"use client";

import Image from "next/image";
import { Tape, Reveal } from "./Primitives";

export default function Moodboard() {
  type TapeCfg = {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    rot?: number;
    w?: number;
  };

  const items: {
    src: string;
    label: string;
    rot: number;
    grid: string;
    tapes: TapeCfg[];
  }[] = [
    {
      src: "/image/home/moodboard/1.jpeg",
      label: "moment 01",
      rot: -3,
      grid: "1 / 1 / 2 / 3",
      tapes: [{ top: -10, right: "18%", rot: 10, w: 70 }],
    },
    {
      src: "/image/home/moodboard/2.jpeg",
      label: "moment 02",
      rot: 2,
      grid: "1 / 3 / 3 / 4",
      tapes: [{ top: -10, left: "40%", rot: -8, w: 70 }],
    },
    {
      src: "/image/home/moodboard/3.jpeg",
      label: "moment 03",
      rot: -1,
      grid: "1 / 4 / 2 / 6",
      tapes: [{ top: -10, left: "12%", rot: -12, w: 80 }],
    },
    {
      src: "/image/home/moodboard/4.jpeg",
      label: "moment 04",
      rot: 4,
      grid: "2 / 1 / 4 / 3",
      tapes: [{ top: -10, right: "20%", rot: 12, w: 60 }],
    },
    {
      src: "/image/home/moodboard/5.jpeg",
      label: "moment 05",
      rot: -4,
      grid: "3 / 3 / 4 / 5",
      tapes: [
        { top: -18, right: "25%", rot: 8, w: 60 },
        { bottom: -18, left: "22%", rot: -6, w: 65 },
      ],
    },
    {
      src: "/image/home/moodboard/6.jpg",
      label: "moment 06",
      rot: 3,
      grid: "2 / 5 / 4 / 6",
      tapes: [{ top: -10, left: "30%", rot: 14, w: 55 }],
    },
  ];

  return (
    <section
      className="section"
      style={{
        background: "var(--paper-2)",
        maxWidth: "none",
        padding: "120px 7vw",
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        <Reveal>
          <div className="section-label" style={{ marginBottom: 50 }}>
            02 · mood + moments
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="moodboard-grid" style={{ marginBottom: 40 }}>
            {items.map((it, i) => (
              <div
                key={i}
                className="moodboard-cell"
                style={{ gridArea: it.grid, position: "relative" }}
              >
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
                  <Image
                    src={it.src}
                    alt={it.label}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 22vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {it.tapes.map((t, ti) => (
                  <Tape key={ti} {...t} />
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="moodboard-caption">
            <p style={{ fontSize: 17, lineHeight: 1.5 }}>
              seven years later, he&rsquo;s basically a pro at grabbing
              attention. snap the right moment or give it that extra spice in
              post?
            </p>
            <p
              className="font-hand"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 28,
                lineHeight: 1.2,
                color: "var(--accent)",
                marginTop: 12,
              }}
            >
              if it&rsquo;s got vibes, ilham&rsquo;s behind it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
