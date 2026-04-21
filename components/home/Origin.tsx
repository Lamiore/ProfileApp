"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Polaroid } from "./Primitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DECK = [
  { src: "/image/home/origin/1.jpg", caption: "Elementry School" },
  { src: "/image/home/origin/2.jpg", caption: "Bocil" },
  { src: "/image/home/origin/3.png", caption: "Catfish Filter" },
];

const CARD_W = 220;
const CARD_H = 280;

function OriginDeck() {
  const [order, setOrder] = useState([0, 1, 2]);

  const bringToFront = (stackPos: number) => {
    setOrder((prev) => {
      if (stackPos === 0) {
        const [front, ...rest] = prev;
        return [...rest, front];
      }
      const next = [...prev];
      const [picked] = next.splice(stackPos, 1);
      return [picked, ...next];
    });
  };

  const stackTransforms = [
    "rotate(-6deg) translate(0, 0)",
    "rotate(-18deg) translate(-56px, 14px)",
    "rotate(10deg) translate(56px, 20px)",
  ];

  return (
    <div className="origin-stack" aria-label="photocards">
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
            role="button"
            tabIndex={0}
            aria-label={`bring ${card.caption} to front`}
            onClick={() => bringToFront(stackPos)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                bringToFront(stackPos);
              }
            }}
          >
            <div
              className="origin-stack-card-inner og-card"
              data-pos={stackPos}
              style={{ opacity: 0 }}
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
          </div>
        );
      })}
    </div>
  );
}

export default function Origin() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      // split paragraphs into word spans for the generate-text effect,
      // preserving inline elements like <em>
      const wrapWords = (node: Node): Node[] => {
        const out: Node[] = [];
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const tokens = (child.textContent || "").split(/(\s+)/);
            tokens.forEach((tok) => {
              if (tok === "") return;
              if (/^\s+$/.test(tok)) {
                out.push(document.createTextNode(tok));
              } else {
                const span = document.createElement("span");
                span.textContent = tok;
                span.className = "og-gen-word";
                span.style.display = "inline-block";
                span.style.willChange = "opacity, filter, transform";
                out.push(span);
              }
            });
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const el = child as HTMLElement;
            const wrapped = wrapWords(el);
            el.innerHTML = "";
            wrapped.forEach((n) => el.appendChild(n));
            out.push(el);
          }
        });
        return out;
      };

      q(".og-gen-text").forEach((p) => {
        const wrapped = wrapWords(p);
        p.innerHTML = "";
        wrapped.forEach((n) => p.appendChild(n));
        (p as HTMLElement).style.visibility = "visible";
      });

      const leftWords = q(".og-gen-left .og-gen-word");
      const rightWords = q(".og-gen-right .og-gen-word");

      gsap.set(q(".og-label"), { opacity: 0, x: -50 });
      gsap.set([...leftWords, ...rightWords], {
        opacity: 0,
        y: 8,
        filter: "blur(10px)",
      });
      gsap.set(q(".og-hand-click"), { opacity: 0, scale: 0.4, rotate: -12 });
      gsap.set(q(".og-hand-punch"), { opacity: 0, scale: 0, rotate: 25 });

      // deck cards — tiap card masuk dari arah beda
      const deckTargets = q(".og-card");
      deckTargets.forEach((el, i) => {
        gsap.set(el, {
          opacity: 0,
          x: [-160, 180, -120][i] ?? 0,
          y: [-120, 160, -80][i] ?? 0,
          rotate: [-380, 420, -540][i] ?? 0,
          scale: 0.4,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.to(q(".og-label"), {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .to(
          leftWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out",
            stagger: { each: 0.022, from: "start" },
          },
          "-=0.35"
        )
        .to(
          deckTargets,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 1.0,
            stagger: 0.14,
            ease: "back.out(1.4)",
          },
          "-=0.9"
        )
        .to(
          rightWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out",
            stagger: { each: 0.02, from: "start" },
          },
          "-=0.7"
        )
        .to(
          q(".og-hand-click"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(1.9)",
          },
          "-=0.2"
        )
        .to(
          q(".og-hand-punch"),
          {
            opacity: 1,
            scale: 1,
            rotate: -3,
            duration: 0.7,
            ease: "back.out(2.2)",
          },
          "-=0.35"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ paddingTop: 60 }}>
      <div className="section-label og-label" style={{ marginBottom: 40 }}>
        01 · origin story
      </div>

      <div className="grid-2">
        <div className="og-copy-l" style={{ position: "relative", paddingTop: 20 }}>
          <p
            className="og-gen-text og-gen-left"
            style={{
              fontSize: 18,
              maxWidth: 600,
              lineHeight: 1.55,
              visibility: "hidden",
            }}
          >
            tiny, curious, and low-key destined for pixels &mdash; though he
            didn&rsquo;t know it yet. by the age of 11, he already had a
            graphics tablet tucked under his arm, half a folder full of
            experiments, and the kind of restless energy that only shows up
            when you&rsquo;ve just figured out you can <em>make</em> things,
            not just watch them.
          </p>

          <OriginDeck />
        </div>

        <div
          className="mobile-text-left origin-right og-copy-r"
          style={{ paddingTop: 140, position: "relative" }}
        >
          <p
            className="og-gen-text og-gen-right"
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              visibility: "hidden",
            }}
          >
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
            <span className="og-hand-click" style={{ display: "inline-block" }}>
              that&rsquo;s when it clicked:
            </span>
            <br />
            <span
              className="og-hand-punch"
              style={{
                display: "inline-block",
                color: "var(--accent)",
                transformOrigin: "left center",
              }}
            >
              people are suckers for pretty visuals.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
