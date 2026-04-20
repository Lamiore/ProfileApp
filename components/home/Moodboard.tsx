"use client";

import { Placeholder, Tape, Reveal } from "./Primitives";

export default function Moodboard() {
  const items = [
    { label: "city fog", rot: -3, grid: "1 / 1 / 2 / 3" },
    { label: "night portrait", rot: 2, grid: "1 / 3 / 3 / 4" },
    { label: "gallery wall", rot: -1, grid: "1 / 4 / 2 / 6" },
    { label: "street scene", rot: 4, grid: "2 / 1 / 4 / 3" },
    { label: "dinner table", rot: -4, grid: "3 / 3 / 4 / 5" },
    { label: "group shot", rot: 3, grid: "2 / 5 / 4 / 6" },
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
              <div key={i} style={{ gridArea: it.grid, position: "relative" }}>
                <Placeholder
                  label={it.label}
                  w="100%"
                  h="100%"
                  rot={it.rot}
                  tone="dark"
                />
                {i === 1 && <Tape top={-10} left="40%" rot={-8} />}
                {i === 3 && <Tape top={-10} right="20%" rot={12} w={60} />}
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
