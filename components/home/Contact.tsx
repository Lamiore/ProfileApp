"use client";

import { Reveal } from "./Primitives";

export default function Contact({ name }: { name: string }) {
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
        className="grid-split"
        style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}
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
                stroke="#d7263d"
                strokeWidth="1.5"
              />
              <polygon
                points="20,60 200,220 380,60"
                fill="#f4b5be"
                stroke="#d7263d"
                strokeWidth="1.5"
              />
              <polygon
                points="20,340 180,200 220,200 380,340"
                fill="#d7263d"
                opacity="0.25"
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: 90,
                left: "10%",
                width: "80%",
                background: "var(--card)",
                padding: "24px 26px",
                transform: "rotate(-2deg)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
                fontFamily: "var(--font-caveat), 'Caveat', cursive",
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
          <div style={{ paddingLeft: 0 }}>
            <h2
              className="contact-big"
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
                { icon: "◎", label: "@ilhmhmmd" },
                { icon: "▶", label: "youtube.com/@ilham" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontFamily:
                      "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
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
        className="hide-mobile"
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 7vw",
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        <span>© {new Date().getFullYear()} {name}</span>
        <span>made with ♥ + caffeine</span>
        <span>v.12.12.24 / home</span>
      </div>
    </section>
  );
}
