"use client";

export default function Marquee() {
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
  const track = [...words, ...words];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1.5px solid var(--ink)",
        borderBottom: "1.5px solid var(--ink)",
        padding: "20px 0",
        background: "#0f0f0f",
        color: "var(--ink)",
      }}
    >
      <div className="marquee-track">
        {track.map((w, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              paddingRight: 40,
              fontSize: 48,
              fontFamily:
                "var(--font-climate-crisis), 'Climate Crisis', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: i % 3 === 0 ? "var(--accent)" : "var(--ink)" }}>
              {w}
            </span>
            <span style={{ fontSize: 24, color: "var(--accent)" }}>✺</span>
          </div>
        ))}
      </div>
    </div>
  );
}
