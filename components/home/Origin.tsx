"use client";

import { Placeholder, Polaroid, Arrow, Scribble, Reveal } from "./Primitives";

export default function Origin() {
  return (
    <section className="section" style={{ paddingTop: 60 }}>
      <Reveal>
        <div className="section-label" style={{ marginBottom: 40 }}>
          01 · origin story
        </div>
      </Reveal>

      <div className="grid-2">
        <Reveal>
          <div style={{ position: "relative", paddingTop: 20 }}>
            <p style={{ fontSize: 18, maxWidth: 440, lineHeight: 1.55 }}>
              tiny, curious, and low-key destined for pixels <br />
              (though he didn&rsquo;t know it yet).
              <br />
              by the time he hit 11, he had a whole graphics <br />
              tablet and half a folder full of experiments.
            </p>

            <div
              className="mobile-stack"
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
              className="font-hand hide-mobile"
              style={{
                position: "absolute",
                left: 180,
                top: 200,
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 22,
                color: "var(--accent)",
                transform: "rotate(-6deg)",
              }}
            >
              glow up fr
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            className="mobile-text-left"
            style={{ paddingTop: 140, position: "relative" }}
          >
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
                fontFamily: "var(--font-caveat), cursive",
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

            <div
              className="hide-mobile"
              style={{ position: "absolute", right: 0, bottom: -20 }}
            >
              <Scribble w={240} h={18} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
