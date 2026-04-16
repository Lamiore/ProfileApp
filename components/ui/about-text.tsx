"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HoverWord({
  children,
  imageSrc,
  imageAlt,
}: {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="about-hover-word"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-block",
        color: "#cbcbcb",
        cursor: "pointer",
        transition: "padding-right 0.8s",
        paddingRight: hovered ? "clamp(80px, 12vw, 160px)" : "0px",
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          display: "block",
          width: hovered ? "clamp(70px, 11vw, 150px)" : "0px",
          height: "clamp(30px, 4.5vw, 60px)",
          overflow: "hidden",
          transform: "translateY(-50%)",
          transition: "width 0.8s",
          borderRadius: "4px",
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: hovered ? "scale(1)" : "scale(1.3)",
            transition: "transform 0.8s",
            transitionDelay: hovered ? "0.2s" : "0s",
          }}
        />
      </span>
    </span>
  );
}

export default function AboutText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: "40px" },
          { opacity: 0.7, y: 0, ease: "power3.out", duration: 1 },
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: "60px" },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 1.2,
          },
          "<0.15"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div
        ref={subtitleRef}
        style={{
          fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
          fontWeight: 500,
          textTransform: "uppercase",
          color: "#7d7d7d",
          letterSpacing: "0.15em",
          opacity: 0,
        }}
      >
        perkenalan
      </div>
      <div
        ref={textRef}
        style={{
          fontSize: "clamp(1.4rem, 4.5vw, 3.8rem)",
          textAlign: "left",
          marginTop: "clamp(1rem, 2vw, 1.8rem)",
          letterSpacing: "-0.038em",
          color: "#fff",
          lineHeight: 1.15,
          fontWeight: 400,
          fontFamily: "Inter, system-ui, sans-serif",
          opacity: 0,
        }}
      >
        Saya seorang designer dan developer yang passionate dalam membangun{" "}
        <HoverWord
          imageSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop"
          imageAlt="coding"
        >
          pengalaman digital
        </HoverWord>{" "}
        yang bermakna. Setiap pixel punya tujuan, setiap animasi punya cerita.
        Saya percaya desain yang baik bukan hanya soal{" "}
        <HoverWord
          imageSrc="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop"
          imageAlt="design"
        >
          tampilan,
        </HoverWord>{" "}
        tapi bagaimana ia terasa — smooth, intentional, dan hidup.
      </div>
    </div>
  );
}
