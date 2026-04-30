"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact({ name }: { name: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      gsap.set(q(".ct-label"), { opacity: 0, x: -30 });
      gsap.set(q(".ct-title-word"), {
        opacity: 0,
        yPercent: 140,
        rotate: (i) => (i % 2 === 0 ? -6 : 6),
      });
      gsap.set(q(".ct-title-wrap"), {
        opacity: 0,
        scale: 0,
        rotate: -20,
        transformOrigin: "left center",
      });
      gsap.set(q(".ct-divider"), {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(q(".ct-footer span"), { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      tl.to(q(".ct-label"), {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .to(
          q(".ct-title-word"),
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "back.out(1.8)",
          },
          "-=0.3"
        )
        .to(
          q(".ct-title-wrap"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(2.2)",
          },
          ">-0.25"
        )
        .to(
          q(".ct-divider"),
          { scaleX: 1, duration: 0.9, ease: "power3.out" },
          "-=0.4"
        )
        .to(
          q(".ct-footer span"),
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section contact-section"
      style={{
        background: "var(--paper-2)",
        maxWidth: "none",
        position: "relative",
        minHeight: "60vh",
      }}
    >
      <div className="contact-inner">
        <span className="section-label ct-label">§ fin / get in touch</span>

        <h2 className="contact-big">
          <span className="ct-title-word">and</span>
          <br />
          <span className="ct-title-word">that&rsquo;s</span>{" "}
          <span className="ct-title-wrap">a wrap.</span>
        </h2>

        <div className="ct-divider" aria-hidden />
      </div>

      <div className="hide-mobile ct-footer">
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <span>made with ♥ + caffeine</span>
        <span>v.12.12.24 / home</span>
      </div>
    </section>
  );
}
