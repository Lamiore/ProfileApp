"use client";

import { useEffect, useRef, useState } from "react";
import { Placeholder, Reveal } from "./Primitives";

export default function Stats() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { label: "IG", h: 88, v: "70%" },
    { label: "TT", h: 62, v: "50%" },
    { label: "YT", h: 96, v: "80%" },
    { label: "X", h: 28, v: "22%" },
    { label: "LI", h: 18, v: "15%" },
  ];

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: "var(--paper-2)", maxWidth: "none" }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 82px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 60,
            }}
          >
            it&rsquo;s not just editing,
            <br />
            <span style={{ color: "var(--accent)" }}>
              it&rsquo;s vibing with visuals.
            </span>
          </h2>
        </Reveal>

        <div className="grid-split">
          <Reveal>
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 16,
                }}
              >
                best performing formats
              </div>

              <div
                style={{
                  fontSize: "clamp(64px, 9vw, 96px)",
                  fontFamily:
                    "var(--font-climate-crisis), 'Climate Crisis', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1,
                  color: "var(--accent)",
                  marginBottom: 40,
                  letterSpacing: "-0.02em",
                }}
              >
                70/35
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 24,
                  height: 180,
                  borderBottom: "1.5px solid var(--ink)",
                  paddingBottom: 4,
                  marginBottom: 12,
                }}
              >
                {bars.map((b, i) => (
                  <div
                    key={b.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: animate ? `${b.h}%` : "0%",
                        background:
                          i === 0 || i === 2 ? "var(--accent)" : "var(--ink)",
                        transition: `height 1.2s cubic-bezier(.2,.9,.3,1) ${i * 0.15}s`,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: -22,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontFamily:
                            "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: "var(--ink)",
                        }}
                      >
                        {b.v}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                {bars.map((b) => (
                  <div
                    key={b.label}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily:
                        "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "var(--muted)",
                    }}
                  >
                    {b.label}
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: 14,
                  marginTop: 30,
                  color: "var(--ink-2)",
                  maxWidth: 400,
                  lineHeight: 1.5,
                }}
              >
                his content primarily resonates with gen-z,
                <br />
                with <b>61%</b> of audience aged 18-24.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="stats-photos">
              <div style={{ gridColumn: "1 / 3" }}>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--ink-2)",
                    marginBottom: 14,
                    maxWidth: 300,
                  }}
                >
                  <b>how to set the tempo</b> as clips fall into rhythm, like
                  choreography? how to write a caption that sticks? how to
                  capture moments that look aesthetic but feel like a story? how
                  to find the perfect hook?
                </p>
              </div>
              <Placeholder label="clip 01" w="100%" h={180} tone="dark" rot={-1} />
              <Placeholder label="clip 02" w="100%" h={180} tone="dark" rot={1} />
              <Placeholder label="clip 03" w="100%" h={180} tone="dark" rot={-1} />
              <Placeholder label="clip 04" w="100%" h={180} tone="dark" rot={2} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
