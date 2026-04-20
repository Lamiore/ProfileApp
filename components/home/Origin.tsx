"use client";

import { useState } from "react";
import { Placeholder, Polaroid, Reveal } from "./Primitives";

const DECK = [
  { label: "kid photo", caption: "11 yr old ilham" },
  { label: "sketch", caption: "early doodles" },
  { label: "setup", caption: "first rig" },
];

function OriginDeck() {
  const [order, setOrder] = useState([0, 1, 2]);

  const cycle = () => {
    setOrder(([front, ...rest]) => [...rest, front]);
  };

  // transform per posisi (index 0 = depan, 1 & 2 = belakang)
  const stackTransforms = [
    "rotate(-6deg) translate(0, 0)",
    "rotate(-18deg) translate(-56px, 14px)",
    "rotate(10deg) translate(56px, 20px)",
  ];

  return (
    <div
      className="origin-stack"
      onClick={cycle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycle();
        }
      }}
      aria-label="cycle photocards"
    >
      {order.map((deckIdx, stackPos) => {
        const card = DECK[deckIdx];
        const isFront = stackPos === 0;
        return (
          <div
            key={deckIdx}
            className="origin-stack-card"
            style={{
              transform: stackTransforms[stackPos],
              zIndex: DECK.length - stackPos,
              opacity: isFront ? 1 : 0.8,
            }}
          >
            <Polaroid
              rot={0}
              caption={isFront ? card.caption : undefined}
              w={220}
              h={280}
            >
              <Placeholder label={card.label} w={220} h={280} tone="dark" />
            </Polaroid>
          </div>
        );
      })}
    </div>
  );
}

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

            <OriginDeck />
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
