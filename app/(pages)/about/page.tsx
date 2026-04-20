"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import {
  Placeholder,
  Tape,
  Polaroid,
  Arrow,
  Scribble,
  Reveal,
  StickyNote,
} from "@/components/about/CollagePrimitives";

const PROFILE = {
  name: "Ilham Mohammad",
  role: "designer · developer · video editor",
  accent: "#d7263d",
  paperTexture: false,
};

const ACCENT_SWATCHES = ["#d7263d", "#0f0f0f", "#1f5f3f", "#d97706", "#1e40af"];

/* ─────────────────────────── HERO ─────────────────────────── */
function Hero({ name, role }: { name: string; role: string }) {
  const [hover, setHover] = useState(false);
  const parts = name.trim().split(/\s+/);
  const first = (parts[0] || name).toUpperCase();
  const last = (parts.slice(1).join(" ") || "").toUpperCase();
  const longest = Math.max(first.length, last.length || 1);
  const vw = Math.min(16, Math.max(6, 72 / longest));

  const displayCommon: CSSProperties = {
    fontSize: `clamp(40px, ${vw}vw, 180px)`,
    color: "var(--accent)",
    lineHeight: 0.82,
    margin: 0,
    textAlign: "center",
    letterSpacing: "-0.05em",
    fontWeight: 400,
    whiteSpace: "nowrap",
    textShadow: "2px 2px 0 rgba(0,0,0,0.04)",
  };

  return (
    <section
      className="section"
      style={{
        minHeight: "100vh",
        paddingTop: 60,
        paddingBottom: 80,
        position: "relative",
      }}
    >
      {/* top-left greeting */}
      <div style={{ position: "absolute", top: 110, left: "7vw", zIndex: 5 }}>
        <div
          className="font-hand"
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontWeight: 600,
            fontSize: 44,
            lineHeight: 1,
            transform: "rotate(-2deg)",
          }}
        >
          hi. since you&rsquo;re new here,
        </div>
      </div>

      {/* top-right greeting */}
      <div
        style={{
          position: "absolute",
          top: 170,
          right: "7vw",
          zIndex: 5,
          textAlign: "right",
        }}
      >
        <div
          className="font-hand"
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontWeight: 600,
            fontSize: 32,
            lineHeight: 1,
            transform: "rotate(3deg)",
            color: "var(--ink-2)",
          }}
        >
          let me be ya tour guide →
        </div>
      </div>

      {/* huge name behind portrait */}
      <div
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
        }}
      >
        <h1
          className="font-display"
          style={{ ...displayCommon, alignSelf: "flex-start", marginLeft: "6vw" }}
        >
          {first}
        </h1>
        {last && (
          <h1
            className="font-display"
            style={{
              ...displayCommon,
              alignSelf: "flex-end",
              marginRight: "4vw",
              marginTop: "-0.08em",
            }}
          >
            {last}
          </h1>
        )}
      </div>

      {/* "this is" annotation */}
      <div
        className="font-hand"
        style={{
          position: "absolute",
          top: "14%",
          left: "20vw",
          fontFamily: "var(--font-caveat), cursive",
          fontWeight: 600,
          fontSize: 48,
          transform: "rotate(-4deg)",
          zIndex: 3,
          color: "var(--ink)",
        }}
      >
        this is
      </div>

      {/* portrait */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          marginTop: "14vh",
          filter: "contrast(1.1)",
        }}
      >
        <div
          style={{
            width: "clamp(260px, 28vw, 440px)",
            height: "clamp(380px, 42vw, 640px)",
            position: "relative",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Placeholder
            label="portrait cutout"
            w="100%"
            h="100%"
            tone="dark"
            style={{
              filter: hover
                ? "grayscale(0%)"
                : "grayscale(100%) contrast(1.15)",
              transition: "filter 0.4s",
            }}
          />
        </div>
      </div>

      {/* bottom labels */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "7vw",
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
        style={{
          position: "absolute",
          bottom: 40,
          right: "7vw",
          display: "flex",
          alignItems: "center",
          gap: 10,
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
          by {name.toLowerCase()} · {new Date().getFullYear()}
        </div>
      </div>

      {/* scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-caveat), cursive",
          fontSize: 22,
          color: "var(--muted)",
        }}
      >
        scroll ↓
      </div>
    </section>
  );
}

/* ─────────────────────────── ORIGIN ─────────────────────────── */
function Origin() {
  return (
    <section className="section" style={{ paddingTop: 60 }}>
      <Reveal>
        <div className="section-label" style={{ marginBottom: 40 }}>
          01 · origin story
        </div>
      </Reveal>

      <div
        className="two-col"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <Reveal>
          <div style={{ position: "relative", paddingTop: 20 }}>
            <p style={{ fontSize: 18, maxWidth: 440, lineHeight: 1.55 }}>
              tiny, curious, and low-key destined for pixels
              <br />
              (though he didn&rsquo;t know it yet).
              <br />
              by the time he hit 11, he had a whole graphics
              <br />
              tablet and half a folder full of experiments.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                marginTop: 60,
                position: "relative",
              }}
            >
              <Polaroid
                rot={-6}
                caption="11 yr old ilham"
                w={120}
                h={150}
                style={{ flexShrink: 0 }}
              >
                <Placeholder label="kid photo" w={120} h={150} tone="dark" />
              </Polaroid>

              <Arrow variant="curve" w={160} h={80} style={{ marginTop: -20 }} />

              <Polaroid rot={5} w={120} h={150} style={{ flexShrink: 0 }}>
                <Placeholder label="now" w={120} h={150} tone="dark" />
              </Polaroid>
            </div>

            <div
              className="font-hand"
              style={{
                position: "absolute",
                left: 180,
                top: 200,
                fontSize: 22,
                color: "var(--accent)",
                transform: "rotate(-6deg)",
              }}
            >
              glow up fr
            </div>
          </div>
        </Reveal>

        {/* RIGHT */}
        <Reveal delay={200}>
          <div style={{ paddingTop: 140, position: "relative" }}>
            <p style={{ fontSize: 18, lineHeight: 1.55 }}>
              after realizing his edits earned more views with a little
              <br />
              aesthetic flair, he proudly hit 600 followers and
              <br />
              probably thought he was famous.
            </p>

            <p
              className="font-hand"
              style={{
                fontSize: 34,
                lineHeight: 1.1,
                marginTop: 30,
                color: "var(--ink)",
              }}
            >
              that&rsquo;s when it clicked:
              <br />
              <span style={{ color: "var(--accent)" }}>
                people are suckers for pretty visuals.
              </span>
            </p>

            <div style={{ position: "absolute", right: 0, bottom: -20 }}>
              <Scribble w={240} h={18} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── MOODBOARD ─────────────────────────── */
function Moodboard() {
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
          <div
            className="moodboard-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gridTemplateRows: "repeat(3, 140px)",
              gap: 16,
              marginBottom: 40,
            }}
          >
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
          <div
            style={{
              marginTop: 80,
              maxWidth: 520,
              marginLeft: "auto",
              textAlign: "right",
            }}
          >
            <p style={{ fontSize: 17, lineHeight: 1.5 }}>
              seven years later, he&rsquo;s basically a pro at grabbing attention.
              <br />
              snap the right moment or give it that extra spice in post?
              <br />
              <span
                className="font-hand"
                style={{ fontSize: 28, color: "var(--accent)" }}
              >
                if it&rsquo;s got vibes, ilham&rsquo;s behind it.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── MARQUEE ─────────────────────────── */
function Marquee() {
  const words = [
    "video editing",
    "web dev",
    "draw",
    "entrepreneur",
    "motion",
    "branding",
    "storytelling",
    "ui design",
  ];

  const setStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    flexWrap: "nowrap",
  };

  const itemStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 40,
    paddingRight: 40,
    fontFamily: "var(--font-climate-crisis), sans-serif",
    fontSize: 48,
    lineHeight: 1,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const renderSet = (key: string, ariaHidden: boolean) => (
    <div key={key} className="marquee-set" aria-hidden={ariaHidden} style={setStyle}>
      {words.map((w, i) => (
        <span key={`${key}-${w}`} className="marquee-item" style={itemStyle}>
          <span style={{ color: i % 3 === 0 ? "var(--accent)" : "var(--paper)" }}>
            {w}
          </span>
          <span style={{ fontSize: 24, color: "var(--accent)", flexShrink: 0 }}>
            ✺
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="marquee-wrap"
      role="separator"
      aria-label="skills"
      style={{
        overflow: "hidden",
        borderTop: "1.5px solid var(--ink)",
        borderBottom: "1.5px solid var(--ink)",
        padding: "20px 0",
        background: "var(--ink)",
        color: "var(--paper)",
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: "flex",
          width: "max-content",
          flexWrap: "nowrap",
          animation: "marquee-scroll 40s linear infinite",
          willChange: "transform",
        }}
      >
        {renderSet("a", false)}
        {renderSet("b", true)}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────── PILLARS ─────────────────────────── */
function Pillars({ handle }: { handle: string }) {
  return (
    <section className="section" style={{ position: "relative" }}>
      <Reveal>
        <div className="section-label" style={{ marginBottom: 40 }}>
          03 · what i create
        </div>
      </Reveal>

      <div
        className="two-col"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: 60,
          alignItems: "start",
        }}
      >
        <Reveal>
          <div style={{ position: "relative", height: 560 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: -30,
                fontSize: 180,
                fontFamily: "var(--font-climate-crisis), sans-serif",
                color: "var(--accent)",
                lineHeight: 0.8,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                opacity: 0.95,
                zIndex: 0,
              }}
            >
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
              <Placeholder
                label="ilham seated"
                w={340}
                h={440}
                rot={-2}
                tone="dark"
              />
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
              {handle} · 3000+ across platforms
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
                marginTop: 30,
              }}
            >
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
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

/* ─────────────────────────── STATS ─────────────────────────── */
function Stats() {
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
              fontSize: "clamp(40px, 6vw, 82px)",
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

        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 80,
          }}
        >
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
                  fontSize: 96,
                  fontFamily: "var(--font-climate-crisis), sans-serif",
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
                            "var(--font-jetbrains-mono), ui-monospace, monospace",
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
                        "var(--font-jetbrains-mono), ui-monospace, monospace",
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div style={{ gridColumn: "1 / 3" }}>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--ink-2)",
                    marginBottom: 14,
                    maxWidth: 320,
                  }}
                >
                  <b>how to set the tempo</b> as clips fall into rhythm, like
                  choreography?
                  <br />
                  how to write a caption that sticks? how to capture moments
                  that look aesthetic but feel like a story? how to find the
                  perfect hook that makes you stall for hours?
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

/* ─────────────────────────── SKILLS ─────────────────────────── */
function Skills() {
  type Item =
    | {
        type: "photo";
        label: string;
        rot: number;
        style: CSSProperties;
      }
    | { type: "swatch" | "type"; style: CSSProperties };

  const items: Item[] = [
    {
      type: "photo",
      label: "sketch 01",
      rot: -4,
      style: { gridColumn: "1 / 3", gridRow: "1 / 3" },
    },
    {
      type: "photo",
      label: "edit rig",
      rot: 3,
      style: { gridColumn: "3 / 4", gridRow: "1 / 2" },
    },
    { type: "swatch", style: { gridColumn: "4 / 6", gridRow: "1 / 2" } },
    {
      type: "photo",
      label: "site snap",
      rot: -2,
      style: { gridColumn: "6 / 7", gridRow: "1 / 3" },
    },
    {
      type: "photo",
      label: "food",
      rot: 4,
      style: { gridColumn: "7 / 8", gridRow: "1 / 2" },
    },
    {
      type: "photo",
      label: "mockup",
      rot: -3,
      style: { gridColumn: "3 / 5", gridRow: "2 / 3" },
    },
    { type: "type", style: { gridColumn: "5 / 7", gridRow: "2 / 3" } },
    {
      type: "photo",
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

      <div
        style={{
          position: "absolute",
          top: 140,
          left: "20vw",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-climate-crisis), sans-serif",
            fontSize: "clamp(100px, 14vw, 220px)",
            color: "var(--accent)",
            lineHeight: 0.82,
            transform: "rotate(-3deg)",
            textShadow: "3px 3px 0 rgba(0,0,0,0.03)",
          }}
        >
          skills
          <br />
          &amp; works
        </div>
      </div>

      <Reveal delay={100}>
        <div
          className="skills-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: "200px 200px",
            gap: 18,
            marginTop: 40,
            position: "relative",
            zIndex: 1,
          }}
        >
          {items.map((it, i) => (
            <div key={i} style={it.style}>
              {it.type === "photo" && (
                <Placeholder
                  label={it.label}
                  w="100%"
                  h="100%"
                  rot={it.rot}
                  tone="dark"
                />
              )}
              {it.type === "swatch" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#fbfaf6",
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
                    background: "#fbfaf6",
                    border: "1px solid var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    padding: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-climate-crisis), sans-serif",
                      fontSize: 64,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-instrument-serif), serif",
                      fontSize: 64,
                      color: "#0f0f0f",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
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
      </Reveal>

      <Reveal delay={300}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 50,
            flexWrap: "wrap",
            gap: 24,
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
          <StickyNote rot={3} color="var(--accent)" style={{ color: "#fff" }}>
            currently working on
            <br />
            portfolio drop 2026
          </StickyNote>
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

/* ─────────────────────────── CONTACT ─────────────────────────── */
function Contact({ name }: { name: string }) {
  return (
    <section
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
        className="two-col"
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        <Reveal>
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
                points="20,60 380,60 380,340 20,340"
                fill="#f4b5be"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <polygon
                points="20,60 200,220 380,60"
                fill="#f4b5be"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <polygon
                points="20,340 180,200 220,200 380,340"
                fill="var(--accent)"
                opacity="0.25"
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: 90,
                left: 50,
                width: 340,
                background: "#fbfaf6",
                padding: "24px 26px",
                transform: "rotate(-2deg)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                fontFamily: "var(--font-caveat), cursive",
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
        </Reveal>

        <Reveal delay={150}>
          <div style={{ paddingLeft: 40 }}>
            <h2
              style={{
                fontSize: "clamp(60px, 10vw, 160px)",
                fontWeight: 800,
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                marginBottom: 40,
              }}
            >
              and
              <br />
              that&rsquo;s
              <br />
              <span style={{ color: "var(--accent)" }}>a wrap.</span>
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
                { icon: "◎", label: "@mohammad" },
                { icon: "▶", label: "github.com/mohammad" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontFamily:
                      "var(--font-jetbrains-mono), ui-monospace, monospace",
                    fontSize: 14,
                  }}
                >
                  <span
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
                    }}
                  >
                    {s.icon}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 60 }}>
              <button className="rough-btn">let&rsquo;s work together →</button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 7vw",
          fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>© {new Date().getFullYear()} {name}</span>
        <span>made with ♥ + caffeine</span>
        <span>v.1.0 / about page</span>
      </div>
    </section>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function AboutPage() {
  const handle = `@${PROFILE.name.trim().toLowerCase().replace(/\s+/g, "")}`;

  return (
    <div
      className={`about-root ${PROFILE.paperTexture ? "about-paper" : ""}`}
      style={{ ["--accent" as string]: PROFILE.accent } as CSSProperties}
    >
      <Hero name={PROFILE.name} role={PROFILE.role} />
      <Origin />
      <Moodboard />
      <Marquee />
      <Pillars handle={handle} />
      <Stats />
      <Skills />
      <Contact name={PROFILE.name} />
    </div>
  );
}
