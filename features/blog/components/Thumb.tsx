"use client";

type Palette = [string, string, string, string];

export default function Thumb({ seed = 1 }: { seed?: number }) {
  const palettes: Palette[] = [
    ["#1a1a1a", "#d7263d", "#2a2a2a", "#f2ede4"],
    ["#111", "#d7263d", "#3a3a3a", "#8a1828"],
    ["#0d0d0d", "#d7263d", "#1f1f1f", "#c9c3b5"],
  ];
  const p = palettes[seed % palettes.length];
  const idx = seed % 6;
  const common = { width: "100%", height: "100%", display: "block" } as const;
  const letter = String.fromCharCode(65 + (seed * 7) % 26);

  return (
    <div className="j-placeholder-fill">
      {idx === 0 && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={common}>
          <rect width="400" height="300" fill={p[0]} />
          <polygon points="0,0 400,0 400,300" fill={p[1]} opacity="0.9" />
          <circle cx="290" cy="90" r="46" fill={p[3]} opacity="0.95" />
          <rect x="40" y="200" width="80" height="80" fill={p[3]} />
        </svg>
      )}
      {idx === 1 && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={common}>
          <rect width="400" height="300" fill={p[0]} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={i * 80}
              y="0"
              width="40"
              height="300"
              fill={i % 2 === 0 ? p[1] : p[2]}
            />
          ))}
          <circle cx="200" cy="150" r="70" fill={p[3]} opacity="0.92" />
        </svg>
      )}
      {idx === 2 && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={common}>
          <rect width="400" height="300" fill={p[2]} />
          {Array.from({ length: 10 }).map((_, x) =>
            Array.from({ length: 8 }).map((_, y) => (
              <circle
                key={`${x}-${y}`}
                cx={20 + x * 40}
                cy={20 + y * 40}
                r={(x + y) % 3 === 0 ? 8 : 3}
                fill={(x + y) % 5 === 0 ? p[1] : p[3]}
                opacity="0.75"
              />
            ))
          )}
        </svg>
      )}
      {idx === 3 && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={common}>
          <rect width="400" height="300" fill={p[1]} />
          <text
            x="20"
            y="240"
            fontFamily="'Climate Crisis', sans-serif"
            fontSize="220"
            fill={p[0]}
            letterSpacing="-8"
          >
            {letter}
          </text>
          <rect x="0" y="260" width="400" height="40" fill={p[0]} />
        </svg>
      )}
      {idx === 4 && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={common}>
          <rect width="400" height="300" fill={p[0]} />
          <circle cx="120" cy="150" r="130" fill={p[1]} />
          <circle
            cx="280"
            cy="130"
            r="100"
            fill={p[3]}
            opacity="0.85"
            style={{ mixBlendMode: "difference" }}
          />
          <circle cx="250" cy="220" r="60" fill={p[2]} />
        </svg>
      )}
      {idx === 5 && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={common}>
          <rect width="400" height="300" fill={p[0]} />
          <rect x="60" y="50" width="200" height="200" fill={p[3]} />
          <rect x="140" y="110" width="200" height="160" fill={p[1]} opacity="0.92" />
          <line x1="0" y1="280" x2="400" y2="280" stroke={p[3]} strokeWidth="2" />
        </svg>
      )}
    </div>
  );
}
