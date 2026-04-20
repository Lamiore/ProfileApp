"use client";

import { useState } from "react";
import Image from "next/image";
import { Polaroid, Reveal } from "./Primitives";

const DECK = [
  { src: "/image/home/origin/1.jpg", caption: "11 yr old ilham" },
  { src: "/image/home/origin/2.jpg", caption: "early doodles" },
  { src: "/image/home/origin/3.png", caption: "first rig" },
];

const CARD_W = 220;
const CARD_H = 280;

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
              w={CARD_W}
              h={CARD_H}
            >
              <div
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  position: "relative",
                  overflow: "hidden",
                  background: "#1a1a1a",
                }}
              >
                <Image
                  src={card.src}
                  alt={card.caption}
                  fill
                  sizes="220px"
                  style={{ objectFit: "cover" }}
                />
              </div>
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
            <p style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.55 }}>
              tiny, curious, and low-key destined for pixels &mdash; though he
              didn&rsquo;t know it yet. by the age of 11, he already had a
              graphics tablet tucked under his arm, half a folder full of
              experiments, and the kind of restless energy that only shows up
              when you&rsquo;ve just figured out you can <em>make</em> things,
              not just watch them.
            </p>

            <OriginDeck />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            className="mobile-text-left origin-right"
            style={{ paddingTop: 140, position: "relative" }}
          >
            <p style={{ fontSize: 18, lineHeight: 1.55 }}>
              after realizing his edits earned way more views with a little
              aesthetic flair &mdash; the right colors, the right cut on the
              beat, a cover that actually made you stop scrolling &mdash; he
              proudly hit 600 followers and probably thought he was famous.
              somewhere between the comments and the save count, the obsession
              quietly began.
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
