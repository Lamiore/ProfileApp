"use client";

import { CSSProperties } from "react";
import { Placeholder, Polaroid, Tape, Reveal } from "./Primitives";

export default function Pillars() {
  const verticalText: CSSProperties = {
    position: "absolute",
    top: 0,
    left: -30,
    fontSize: 180,
    fontFamily:
      "var(--font-climate-crisis), 'Climate Crisis', sans-serif",
    color: "var(--accent)",
    lineHeight: 0.8,
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    opacity: 0.95,
    zIndex: 0,
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <Reveal>
        <div className="section-label" style={{ marginBottom: 40 }}>
          03 · what i create
        </div>
      </Reveal>

      <div className="pillars-grid">
        <Reveal>
          <div style={{ position: "relative", height: 560 }}>
            <div className="hide-mobile" style={verticalText}>
              PIXEL ARTIST
            </div>
            <div
              style={{
                position: "relative",
                zIndex: 2,
                marginLeft: 60,
                marginTop: 40,
              }}
            >
              <Placeholder label="ilham seated" w={340} h={440} rot={-2} tone="dark" />
              <Tape top={-10} left="30%" rot={-8} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div style={{ paddingTop: 40 }}>
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 20,
                display: "inline-block",
                border: "1px solid var(--ink)",
                padding: "6px 12px",
                borderRadius: 999,
              }}
            >
              @ilhmhmmd · 3000+ across platforms
            </div>

            <div className="grid-2" style={{ gap: 40, marginTop: 30 }}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 14, fontWeight: 600 }}>
                  i love content creating and
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>
                  enjoying snippets of my lifestyle that reflect intentional
                  living, self-growth, and an eye for aesthetic.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 14, fontWeight: 600 }}>
                  i do
                </h3>
                <ul style={{ listStyle: "none", fontSize: 15, lineHeight: 1.9 }}>
                  {[
                    "video scripting",
                    "video editing",
                    "graphic design",
                    "web development",
                    "branding",
                  ].map((s) => (
                    <li
                      key={s}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          background: "var(--accent)",
                          display: "inline-block",
                          borderRadius: "50%",
                        }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 50 }}>
              <Polaroid
                rot={-3}
                caption="such aa..."
                w={260}
                h={180}
                style={{ display: "inline-block" }}
              >
                <Placeholder label="bedroom shot" w={260} h={180} tone="dark" />
              </Polaroid>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
