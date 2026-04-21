"use client";

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type Tone = "dark" | "light";

/* ─── Diagonal-striped placeholder with mono label ─────────────── */
export function Placeholder({
  label = "image",
  w = "100%",
  h = 200,
  rot = 0,
  style,
  tone = "dark",
}: {
  label?: string;
  w?: string | number;
  h?: string | number;
  rot?: number;
  style?: CSSProperties;
  tone?: Tone;
}) {
  const stripeColor =
    tone === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.08)";
  const bg = tone === "dark" ? "#3a3a3a" : "#e4ddcc";
  const textColor = tone === "dark" ? "#8a857c" : "#6b6b66";
  const borderColor = tone === "dark" ? "#4a4a4a" : "#d0c8b5";

  return (
    <div
      style={{
        width: w,
        height: h,
        background: bg,
        backgroundImage: `repeating-linear-gradient(45deg, ${stripeColor} 0 2px, transparent 2px 10px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${rot}deg)`,
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: textColor,
        border: `1px solid ${borderColor}`,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <span style={{ padding: "4px 8px", background: bg, zIndex: 1 }}>
        [ {label} ]
      </span>
    </div>
  );
}

/* ─── Masking-tape strip ───────────────────────────────────────── */
export function Tape({
  top,
  left,
  right,
  bottom,
  rot = 0,
  w = 70,
  color,
  className,
}: {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  rot?: number;
  w?: number;
  color?: string;
  className?: string;
}) {
  const c = color || "rgba(215, 38, 61, 0.22)";
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: w,
        height: 22,
        background: c,
        borderLeft: "1px dashed rgba(0,0,0,0.15)",
        borderRight: "1px dashed rgba(0,0,0,0.15)",
        transform: `rotate(${rot}deg)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        zIndex: 10,
      }}
    />
  );
}

/* ─── Polaroid with optional caption ───────────────────────────── */
export function Polaroid({
  label = "photo",
  caption,
  w = 180,
  h = 200,
  rot = -3,
  children,
  style,
  tone = "dark",
}: {
  label?: string;
  caption?: string;
  w?: number | string;
  h?: number | string;
  rot?: number;
  children?: ReactNode;
  style?: CSSProperties;
  tone?: Tone;
}) {
  return (
    <div
      className="polaroid wobble"
      style={
        {
          "--rot": `${rot}deg`,
          transform: `rotate(${rot}deg)`,
          ...style,
        } as CSSProperties
      }
    >
      {children || <Placeholder label={label} w={w} h={h} tone={tone} />}
      {caption && (
        <div
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: 20,
            textAlign: "center",
            marginTop: 6,
            color: "#1a1a1a",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

/* ─── Handdrawn arrow ──────────────────────────────────────────── */
export function Arrow({
  w = 160,
  h = 80,
  variant = "curve",
  style,
  color = "#f2ede4",
}: {
  w?: number;
  h?: number;
  variant?: "curve" | "zig" | "loop" | "straight";
  style?: CSSProperties;
  color?: string;
}) {
  const paths: Record<string, string> = {
    curve: "M 5 60 Q 60 -20, 130 30 T 150 55",
    zig: "M 5 40 L 30 10 L 60 40 L 90 10 L 130 40",
    loop: "M 5 50 C 40 -10, 100 -10, 130 40 L 110 30 M 130 40 L 120 60",
    straight: "M 5 40 L 150 40",
  };
  return (
    <svg width={w} height={h} viewBox="0 0 160 80" style={style}>
      <path
        d={paths[variant]}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
      <path
        d="M 140 40 L 152 52 M 152 52 L 140 60"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Scribble underline ───────────────────────────────────────── */
export function Scribble({
  w = 200,
  h = 16,
  color,
  style,
}: {
  w?: number;
  h?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const c = color || "var(--accent)";
  return (
    <svg width={w} height={h} viewBox="0 0 200 16" style={style}>
      <path
        d="M 2 10 Q 30 2, 60 8 T 120 6 T 198 10"
        fill="none"
        stroke={c}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Reveal on scroll ─────────────────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Sticky note ──────────────────────────────────────────────── */
export function StickyNote({
  children,
  rot = -2,
  color = "#fff3a8",
  style,
}: {
  children: ReactNode;
  rot?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: color,
        padding: "18px 20px",
        boxShadow:
          "0 6px 12px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        transform: `rotate(${rot}deg)`,
        fontFamily: "var(--font-caveat), cursive",
        fontSize: 22,
        lineHeight: 1.2,
        color: "#1a1a1a",
        maxWidth: 220,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
