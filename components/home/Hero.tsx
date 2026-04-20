"use client";

import { CSSProperties } from "react";
import Image from "next/image";

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
        style={{ position: "absolute", top: 80, left: "7vw", zIndex: 5 }}
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
            transform: "rotate(-18deg)",
            transformOrigin: "right center",
            color: "var(--ink-2)",
            whiteSpace: "nowrap",
          }}
        >
          click here for menu →
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
            src="/image/home/me.png"
            alt={`portrait of ${name}`}
            width={1427}
            height={1340}
            priority
            sizes="(max-width: 480px) 640px, (max-width: 768px) 780px, 980px"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>

      <div
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
        className="hide-mobile"
        style={{ position: "absolute", bottom: 40, right: "7vw", zIndex: 5 }}
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
          zIndex: 5,
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
