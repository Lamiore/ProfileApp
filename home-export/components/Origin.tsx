"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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
        duration: 0.45,
        ease: "power3.out",
      })
        .to(
          leftWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out",
            stagger: { each: 0.014, from: "start" },
          },
          "-=0.1"
        )
        .to(
          rightWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out",
            stagger: { each: 0.013, from: "start" },
          },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section og-section"
      style={{
        paddingTop: 60,
        position: "relative",
        zIndex: 2,
        background: "var(--paper)",
      }}
    >
      <div className="section-label og-label" style={{ marginBottom: 40 }}>
        01 · origin story
      </div>

      <div className="og-text-stack">
        <p
          className="og-gen-text og-gen-left og-body"
          style={{ visibility: "hidden" }}
        >
          lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>

        <p
          className="og-gen-text og-gen-right og-body"
          style={{ visibility: "hidden" }}
        >
          excepteur sint occaecat cupidatat non proident — sunt in culpa
          qui officia deserunt mollit anim id est laborum — sed ut
          perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
          quae ab illo inventore veritatis et quasi architecto beatae
          vitae dicta sunt explicabo.
        </p>
      </div>
    </section>
  );
}
