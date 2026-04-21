"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tape } from "./Primitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Moodboard() {
  type TapeCfg = {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    rot?: number;
    w?: number;
  };

  const items: {
    src: string;
    label: string;
    rot: number;
    grid: string;
    tapes: TapeCfg[];
  }[] = [
    {
      src: "/image/home/moodboard/1.jpeg",
      label: "moment 01",
      rot: -3,
      grid: "1 / 1 / 2 / 3",
      tapes: [{ top: -10, right: "18%", rot: 10, w: 70 }],
    },
    {
      src: "/image/home/moodboard/2.jpeg",
      label: "moment 02",
      rot: 2,
      grid: "1 / 3 / 3 / 4",
      tapes: [{ top: -10, left: "40%", rot: -8, w: 70 }],
    },
    {
      src: "/image/home/moodboard/3.jpeg",
      label: "moment 03",
      rot: -1,
      grid: "1 / 4 / 2 / 6",
      tapes: [{ top: -10, left: "12%", rot: -12, w: 80 }],
    },
    {
      src: "/image/home/moodboard/4.jpeg",
      label: "moment 04",
      rot: 4,
      grid: "2 / 1 / 4 / 3",
      tapes: [{ top: -10, right: "20%", rot: 12, w: 60 }],
    },
    {
      src: "/image/home/moodboard/5.jpeg",
      label: "moment 05",
      rot: -4,
      grid: "3 / 3 / 4 / 5",
      tapes: [
        { top: -18, right: "25%", rot: 8, w: 60 },
        { bottom: -18, left: "22%", rot: -6, w: 65 },
      ],
    },
    {
      src: "/image/home/moodboard/6.jpg",
      label: "moment 06",
      rot: 3,
      grid: "2 / 5 / 4 / 6",
      tapes: [{ top: -10, left: "30%", rot: 14, w: 55 }],
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      gsap.set(q(".mb-label"), { opacity: 0, x: -50 });
      gsap.set(q(".mb-caption p"), { opacity: 0, y: 24 });
      gsap.set(q(".mb-hand"), { opacity: 0, scale: 0, rotate: 10 });

      // setiap foto scatter-in dari arah random
      const cells = q(".moodboard-cell");
      cells.forEach((cell, i) => {
        const photo = cell.querySelector<HTMLElement>(".mb-photo");
        const tapes = cell.querySelectorAll<HTMLElement>(".mb-tape");

        if (photo) {
          const dirs = [
            { x: -200, y: -120, r: -40 },
            { x: 160, y: -140, r: 35 },
            { x: -140, y: 180, r: -25 },
            { x: 180, y: 140, r: 45 },
            { x: 0, y: -220, r: -60 },
            { x: 0, y: 200, r: 50 },
          ];
          const d = dirs[i % dirs.length];
          gsap.set(photo, {
            opacity: 0,
            x: d.x,
            y: d.y,
            rotate: d.r,
            scale: 0.5,
          });
        }
        tapes.forEach((t) =>
          gsap.set(t, { opacity: 0, scale: 0, transformOrigin: "center center" })
        );
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.to(q(".mb-label"), {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      cells.forEach((cell, i) => {
        const photo = cell.querySelector<HTMLElement>(".mb-photo");
        const tapes = cell.querySelectorAll<HTMLElement>(".mb-tape");
        const rotFinal = parseFloat(cell.getAttribute("data-rot") || "0");

        tl.to(
          photo,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: rotFinal,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.3)",
          },
          0.25 + i * 0.09
        );

        if (tapes.length) {
          tl.to(
            tapes,
            {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: "back.out(2.4)",
            },
            0.55 + i * 0.09
          );
        }
      });

      tl.to(
        q(".mb-caption p"),
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
        ">-0.3"
      ).to(
        q(".mb-hand"),
        {
          opacity: 1,
          scale: 1,
          rotate: -2,
          duration: 0.7,
          ease: "back.out(2)",
        },
        "<0.1"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: "var(--paper-2)",
        maxWidth: "none",
        padding: "120px 7vw",
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        <div className="section-label mb-label" style={{ marginBottom: 50 }}>
          02 · mood + moments
        </div>

        <div className="moodboard-grid" style={{ marginBottom: 40 }}>
          {items.map((it, i) => (
            <div
              key={i}
              className="moodboard-cell"
              data-rot={it.rot}
              style={{ gridArea: it.grid, position: "relative" }}
            >
              <div
                className="mb-photo"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${it.rot}deg)`,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.18), 0 10px 24px rgba(0,0,0,0.35)",
                  background: "#1a1a1a",
                }}
              >
                <Image
                  src={it.src}
                  alt={it.label}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 22vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              {it.tapes.map((t, ti) => (
                <Tape key={ti} className="mb-tape" {...t} />
              ))}
            </div>
          ))}
        </div>

        <div className="moodboard-caption mb-caption">
          <p style={{ fontSize: 17, lineHeight: 1.5 }}>
            seven years later, he&rsquo;s basically a pro at grabbing
            attention. snap the right moment or give it that extra spice in
            post?
          </p>
          <p
            className="font-hand mb-hand"
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 28,
              lineHeight: 1.2,
              color: "var(--accent)",
              marginTop: 12,
              display: "inline-block",
            }}
          >
            if it&rsquo;s got vibes, ilham&rsquo;s behind it.
          </p>
        </div>
      </div>
    </section>
  );
}
