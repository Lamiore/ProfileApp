"use client";

import { CSSProperties } from "react";
import { Placeholder, Tape } from "./Primitives";

export default function Hero({ name, role }: { name: string; role: string }) {
  const parts = name.trim().split(/\s+/);
  const first = (parts[0] || name).toUpperCase();
  const last = (parts.slice(1).join(" ") || "").toUpperCase();
  const longest = Math.max(first.length, last.length || 1);
  const vw = Math.min(16, Math.max(6, 72 / longest));

  const common: CSSProperties = {
    fontFamily: "var(--font-climate-crisis), 'Climate Crisis', 'Rubik Mono One', sans-serif",
    fontSize: `clamp(40px, ${vw}vw, 180px)`,
    color: "var(--accent)",
    lineHeight: 0.82,
    margin: 0,
    textAlign: "center",
    letterSpacing: "-0.05em",
    fontWeight: 400,
    whiteSpace: "nowrap",
    textShadow: "2px 2px 0 rgba(0,0,0,0.08)",
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
      <div
        className="hero-script"
        style={{ position: "absolute", top: 40, left: "7vw", zIndex: 5 }}
      >
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

      <div
        className="hero-script-sm hide-mobile"
        style={{
          position: "absolute",
          top: 100,
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
          style={{ ...common, alignSelf: "flex-start", marginLeft: "6vw" }}
        >
          {first}
        </h1>
        {last && (
          <h1
            className="font-display"
            style={{
              ...common,
              alignSelf: "flex-end",
              marginRight: "4vw",
              marginTop: "-0.08em",
            }}
          >
            {last}
          </h1>
        )}
      </div>

      <div
        className="font-hand hide-mobile"
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

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          marginTop: "14vh",
        }}
      >
        <div
          style={{
            width: "clamp(240px, 28vw, 440px)",
            height: "clamp(340px, 42vw, 640px)",
            position: "relative",
          }}
        >
          <Placeholder
            label="portrait cutout"
            w="100%"
            h="100%"
            tone="dark"
            style={{ filter: "grayscale(100%) contrast(1.15)" }}
          />
          <Tape top={-8} left={-10} rot={-35} />
          <Tape bottom={-8} right={-10} rot={-30} />
        </div>
      </div>

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
        className="hide-mobile"
        style={{ position: "absolute", bottom: 40, right: "7vw" }}
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
        style={{
          position: "absolute",
          bottom: 10,
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
