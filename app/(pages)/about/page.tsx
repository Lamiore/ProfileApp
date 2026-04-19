"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoLoop } from "@/components/ui/LogoLoop";
import {
  Figma,
  Github,
  Code,
  Palette,
  Layers,
  Monitor,
  Smartphone,
  Globe,
  Zap,
  PenTool,
  Mail,
  Instagram,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517242810446-cc8951b2be40?w=2400&q=85&auto=format&fit=crop";

const logos = [
  { node: <Figma size={22} />, title: "Figma" },
  { node: <Github size={22} />, title: "GitHub" },
  { node: <Code size={22} />, title: "Code" },
  { node: <Palette size={22} />, title: "Design" },
  { node: <Layers size={22} />, title: "Layers" },
  { node: <Monitor size={22} />, title: "Desktop" },
  { node: <Smartphone size={22} />, title: "Mobile" },
  { node: <Globe size={22} />, title: "Web" },
  { node: <Zap size={22} />, title: "Performance" },
  { node: <PenTool size={22} />, title: "Creative" },
];

const timeline = [
  {
    year: "2019",
    title: "Awal mula",
    place: "Bandung — Self-taught",
    desc: "Pertama kenal Figma dan mulai ngulik design poster, UI kit, dan tutorial YouTube sampai tengah malam.",
  },
  {
    year: "2021",
    title: "Klien pertama",
    place: "Freelance — UI/UX",
    desc: "Ngerjain brand identity dan landing page kecil. Belajar yang paling penting: design itu dialog, bukan monolog.",
  },
  {
    year: "2023",
    title: "Pindah ke web",
    place: "React • Next.js • Three.js",
    desc: "Berhenti kasih mockup statis — mulai nge-ship produk beneran. Dari design ke code, dari idea ke pixel yang hidup.",
  },
  {
    year: "2025",
    title: "Hybrid craft",
    place: "Designer yang nulis code",
    desc: "Menemukan ritme di persimpangan: desain yang bisa di-build, dan code yang terasa didesain. Dua-duanya satu bahasa.",
  },
  {
    year: "Now",
    title: "Building experiences",
    place: "Open for collaboration",
    desc: "Fokus di interface yang smooth, intentional, dan terasa personal. Tiap proyek — tiap pixel — punya cerita.",
  },
];

const works = [
  {
    title: "Personal Portfolio",
    category: "Creative / 3D",
    description: "Portfolio dengan elemen 3D dan animasi halus yang menonjolkan atmosfer.",
    tags: ["Next.js", "Three.js", "GSAP"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "E-Commerce",
    category: "Fullstack",
    description: "Platform belanja dengan checkout yang cepat dan UI yang tenang.",
    tags: ["React", "TypeScript"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Analytics Board",
    category: "Dashboard",
    description: "Visualisasi data real-time dengan chart yang bisa disentuh.",
    tags: ["Next.js", "D3.js"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Mobile App",
    category: "Product",
    description: "Aplikasi lintas-platform dengan performa native.",
    tags: ["React Native"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Brand System",
    category: "Identity",
    description: "Dari logo sampai sistem digital — satu suara, banyak permukaan.",
    tags: ["Figma", "Branding"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80&auto=format&fit=crop",
    span: "md:col-span-2 md:row-span-1",
  },
];

const connects = [
  {
    label: "Email",
    handle: "ilham_lam@icloud.com",
    href: "mailto:ilham_lam@icloud.com",
    icon: Mail,
    note: "Paling cepat — biasanya balas dalam 24 jam.",
  },
  {
    label: "GitHub",
    handle: "@lamiore",
    href: "https://github.com/lamiore",
    icon: Github,
    note: "Tempat kerja terbuka. Issues welcome.",
  },
  {
    label: "Instagram",
    handle: "@ilhm.lam",
    href: "https://instagram.com",
    icon: Instagram,
    note: "Proses, moodboard, dan hal-hal kecil.",
  },
  {
    label: "LinkedIn",
    handle: "/in/ilham-lam",
    href: "https://linkedin.com",
    icon: Linkedin,
    note: "Untuk yang lebih formal. Resume ada di sana.",
  },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero entrance
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .fromTo(
          ".hero-image",
          { scale: 1.12, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
        )
        .fromTo(
          ".hero-eyebrow",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=1.5"
        )
        .fromTo(
          ".hero-title .reveal-line",
          { y: "110%" },
          { y: "0%", duration: 1.1, stagger: 0.12 },
          "-=0.6"
        )
        .fromTo(
          ".hero-desc",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6"
        )
        .fromTo(
          ".hero-meta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          "-=0.7"
        );

      // Generic reveal for sections
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      // Timeline line fill
      const line = document.querySelector<HTMLElement>(".timeline-line-fill");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline-root",
              start: "top 65%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          }
        );
      }

      // Timeline items
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((el) => {
        gsap.fromTo(
          el,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#0d0d0d",
        color: "#f2efe9",
        fontFamily: "var(--font-satoshi), system-ui, sans-serif",
      }}
    >
      {/* ──────────────────────────────── HERO ──────────────────────────────── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          minHeight: 640,
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div
          className="hero-image"
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform, opacity",
          }}
        >
          <img
            src={HERO_IMAGE}
            alt="Atmosfer tempat kerja"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "grayscale(0.35) contrast(1.05) brightness(0.82)",
            }}
          />
        </div>

        {/* Gradient overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.15) 35%, rgba(13,13,13,0.75) 80%, #0d0d0d 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 100%, rgba(0,0,0,0.55), transparent 60%)",
          }}
        />
        {/* grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")",
          }}
        />

        {/* Content grid */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(100px, 14vh, 140px) clamp(1.25rem, 5vw, 4rem) clamp(2rem, 5vh, 3.5rem)",
          }}
        >
          {/* Top meta row */}
          <div
            className="hero-eyebrow"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "clamp(0.65rem, 0.9vw, 0.8rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242,239,233,0.55)",
            }}
          >
            <span>— About / 00</span>
            <span style={{ textAlign: "right" }}>
              Bandung, ID
              <br />
              <span style={{ opacity: 0.55 }}>6°54′ S · 107°36′ E</span>
            </span>
          </div>

          {/* Title block */}
          <div>
            <h1
              className="hero-title"
              style={{
                margin: 0,
                color: "#f5f1e8",
                fontFamily: "var(--font-satoshi), system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(3.2rem, 11vw, 10.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.045em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ display: "block", overflow: "hidden" }}>
                <span
                  className="reveal-line"
                  style={{ display: "block", willChange: "transform" }}
                >
                  Ilham
                </span>
              </span>
              <span
                style={{
                  display: "block",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <span
                  className="reveal-line"
                  style={{
                    display: "inline-block",
                    willChange: "transform",
                    position: "relative",
                  }}
                >
                  Lamiore
                  <span
                    aria-hidden
                    style={{
                      fontFamily: "var(--font-sacramento), cursive",
                      fontWeight: 400,
                      fontSize: "0.28em",
                      letterSpacing: "0",
                      textTransform: "none",
                      color: "#e8c07d",
                      position: "absolute",
                      top: "-0.25em",
                      right: "-1.8em",
                      transform: "rotate(-8deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    — a.k.a Lam
                  </span>
                </span>
              </span>
            </h1>

            <div
              style={{
                marginTop: "clamp(1.2rem, 2.5vh, 2rem)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: "clamp(1rem, 3vw, 3rem)",
                maxWidth: 1100,
              }}
            >
              <p
                className="hero-desc"
                style={{
                  margin: 0,
                  fontSize: "clamp(0.95rem, 1.25vw, 1.15rem)",
                  lineHeight: 1.55,
                  color: "rgba(242,239,233,0.82)",
                  maxWidth: 560,
                }}
              >
                Designer sekaligus developer yang meracik interface supaya
                terasa smooth, intentional, dan sedikit manusiawi. Berbasis di
                Indonesia, bekerja untuk siapapun yang peduli detail.
              </p>
              <div
                className="hero-meta"
                style={{
                  alignSelf: "end",
                  justifySelf: "end",
                  display: "flex",
                  gap: "clamp(1rem, 2.5vw, 2.5rem)",
                  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
                  color: "rgba(242,239,233,0.55)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span>
                  <span style={{ color: "rgba(242,239,233,0.35)" }}>Role</span>
                  <br />
                  Designer · Dev
                </span>
                <span>
                  <span style={{ color: "rgba(242,239,233,0.35)" }}>Since</span>
                  <br />
                  2019
                </span>
                <span>
                  <span style={{ color: "rgba(242,239,233,0.35)" }}>Status</span>
                  <br />
                  <span style={{ color: "#b7e2a6" }}>● Available</span>
                </span>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div
            className="hero-meta"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(242,239,233,0.45)",
            }}
          >
            <span>↓ Scroll</span>
            <span>Perjalanan singkat · Karya terpilih · Koneksi</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── ABOUT ──────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 12rem) clamp(1.25rem, 5vw, 4rem) clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div
          data-reveal
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.4fr) minmax(0, 1fr)",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "start",
          }}
          className="about-grid"
        >
          <div
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242,239,233,0.5)",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(242,239,233,0.2)",
            }}
          >
            <div>01 — Perkenalan</div>
            <div style={{ marginTop: "0.5rem", color: "rgba(242,239,233,0.3)" }}>
              Kira-kira begini
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "clamp(1.5rem, 3.2vw, 2.8rem)",
                lineHeight: 1.2,
                margin: 0,
                color: "#f5f1e8",
                letterSpacing: "-0.02em",
                fontWeight: 400,
              }}
            >
              Saya percaya desain yang baik{" "}
              <span
                style={{
                  fontFamily: "var(--font-sacramento), cursive",
                  fontWeight: 400,
                  color: "#e8c07d",
                  fontSize: "1.1em",
                }}
              >
                bukan cuma soal tampilan
              </span>
              {" "}— tapi bagaimana ia terasa: halus, disengaja, dan punya
              napas.
            </p>

            <div
              style={{
                marginTop: "clamp(2rem, 4vh, 3rem)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "rgba(242,239,233,0.7)",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              <p style={{ margin: 0 }}>
                Mulai dari desain grafis, kemudian jatuh cinta sama
                <em style={{ color: "#f5f1e8", fontStyle: "normal", fontWeight: 600 }}> web — </em>
                tempat di mana pixel bisa bergerak, merespon, dan hidup. Sejak
                itu saya nggak pernah berhenti ngulik.
              </p>
              <p style={{ margin: 0 }}>
                Sekarang saya kerjain keduanya: desain di Figma, lalu
                ngebangunnya pakai React / Next.js / Three.js. Kerjaan favorit
                saya adalah yang kelihatan <em style={{ color: "#f5f1e8", fontStyle: "normal", fontWeight: 600 }}>simpel</em> tapi butuh banyak detail kecil.
              </p>
              <p style={{ margin: 0 }}>
                Di luar layar — saya suka kopi manual brew, fotografi jalanan,
                dan musik yang lambat. Hal-hal kecil yang bikin pekerjaan
                terasa lebih sabar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Loop Divider */}
      <section
        style={{
          padding: "3rem 0",
          borderTop: "1px solid rgba(242,239,233,0.08)",
          borderBottom: "1px solid rgba(242,239,233,0.08)",
        }}
      >
        <div style={{ color: "rgba(242,239,233,0.4)" }}>
          <LogoLoop
            logos={logos}
            speed={70}
            logoHeight={22}
            gap={52}
            pauseOnHover
            fadeOut
            fadeOutColor="#0d0d0d"
          />
        </div>
      </section>

      {/* ──────────────────────────────── TIMELINE ──────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 12rem) clamp(1.25rem, 5vw, 4rem)",
        }}
      >
        <header
          data-reveal
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.4fr) minmax(0, 1fr)",
            gap: "clamp(2rem, 5vw, 5rem)",
            marginBottom: "clamp(3rem, 7vh, 6rem)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242,239,233,0.5)",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(242,239,233,0.2)",
            }}
          >
            <div>02 — Journey</div>
            <div style={{ marginTop: "0.5rem", color: "rgba(242,239,233,0.3)" }}>
              Sedikit garis waktu
            </div>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                fontFamily: "var(--font-satoshi), system-ui, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
                color: "#f5f1e8",
              }}
            >
              Dari poster ke pixel{" "}
              <span
                style={{
                  fontFamily: "var(--font-sacramento), cursive",
                  fontWeight: 400,
                  fontSize: "0.55em",
                  color: "#e8c07d",
                  letterSpacing: "0",
                  whiteSpace: "nowrap",
                }}
              >
                yang hidup.
              </span>
            </h2>
          </div>
        </header>

        <div
          className="timeline-root"
          style={{
            position: "relative",
            paddingLeft: "clamp(4rem, 10vw, 8rem)",
          }}
        >
          {/* Rail */}
          <div
            style={{
              position: "absolute",
              left: "clamp(3rem, 7vw, 5.5rem)",
              top: 8,
              bottom: 8,
              width: 1,
              background: "rgba(242,239,233,0.1)",
            }}
          />
          <div
            className="timeline-line-fill"
            style={{
              position: "absolute",
              left: "clamp(3rem, 7vw, 5.5rem)",
              top: 8,
              bottom: 8,
              width: 1,
              background:
                "linear-gradient(180deg, #e8c07d 0%, #f5f1e8 40%, rgba(242,239,233,0.1) 100%)",
              transformOrigin: "top",
            }}
          />

          <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {timeline.map((item, i) => (
              <li
                key={i}
                className="timeline-item"
                style={{
                  position: "relative",
                  padding: "clamp(1.8rem, 3.5vh, 2.8rem) 0",
                  borderBottom:
                    i === timeline.length - 1
                      ? "none"
                      : "1px solid rgba(242,239,233,0.08)",
                }}
              >
                {/* Dot */}
                <span
                  style={{
                    position: "absolute",
                    left: "calc(clamp(3rem, 7vw, 5.5rem) - clamp(4rem, 10vw, 8rem))",
                    top: "calc(clamp(1.8rem, 3.5vh, 2.8rem) + 0.65rem)",
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: "#0d0d0d",
                    border: "2px solid #e8c07d",
                    transform: "translateX(-5px)",
                    boxShadow: "0 0 0 6px #0d0d0d",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 0.3fr) minmax(0, 1fr)",
                    gap: "clamp(1rem, 3vw, 3rem)",
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                      fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                      color: "#e8c07d",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.year}
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
                        fontWeight: 700,
                        color: "#f5f1e8",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.title}
                    </h3>
                    <div
                      style={{
                        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                        fontSize: "0.72rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(242,239,233,0.4)",
                        marginTop: "0.45rem",
                      }}
                    >
                      {item.place}
                    </div>
                    <p
                      style={{
                        margin: "0.9rem 0 0",
                        color: "rgba(242,239,233,0.7)",
                        fontSize: "1rem",
                        lineHeight: 1.65,
                        maxWidth: 620,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ──────────────────────────────── WORK BENTO ──────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 12rem) clamp(1.25rem, 5vw, 4rem)",
        }}
      >
        <header
          data-reveal
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.4fr) minmax(0, 1fr)",
            gap: "clamp(2rem, 5vw, 5rem)",
            marginBottom: "clamp(3rem, 7vh, 5rem)",
            alignItems: "end",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242,239,233,0.5)",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(242,239,233,0.2)",
            }}
          >
            <div>03 — Selected Work</div>
            <div style={{ marginTop: "0.5rem", color: "rgba(242,239,233,0.3)" }}>
              Pilihan karya
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                fontFamily: "var(--font-satoshi), system-ui, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
                color: "#f5f1e8",
              }}
            >
              Things I&rsquo;ve made.
            </h2>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(242,239,233,0.4)",
              }}
            >
              {works.length} projects — 2023 / 2026
            </span>
          </div>
        </header>

        <div
          data-reveal
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[260px] gap-3"
        >
          {works.map((work, i) => (
            <a
              key={i}
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-pointer transition-all duration-500 hover:border-[#e8c07d]/40 ${work.span}`}
            >
              <img
                src={work.image}
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                style={{ filter: "grayscale(0.15) brightness(0.9)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

              {/* top badge */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(242,239,233,0.7)",
                    background: "rgba(13,13,13,0.5)",
                    backdropFilter: "blur(6px)",
                    padding: "0.35rem 0.6rem",
                    borderRadius: 999,
                    border: "1px solid rgba(242,239,233,0.15)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} / {work.category}
                </span>
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    color: "#f5f1e8",
                    background: "rgba(232,192,125,0.2)",
                    backdropFilter: "blur(6px)",
                    padding: "0.4rem",
                    borderRadius: 999,
                    border: "1px solid rgba(232,192,125,0.4)",
                  }}
                >
                  <ArrowUpRight size={14} />
                </span>
              </div>

              {/* bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  style={{
                    fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
                    fontWeight: 800,
                    color: "#f5f1e8",
                    margin: "0 0 0.5rem 0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {work.title}
                </h3>
                <p
                  className="text-white/60 text-sm leading-relaxed m-0 mb-3"
                  style={{ maxWidth: 380 }}
                >
                  {work.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "0.3rem 0.55rem",
                        borderRadius: 4,
                        background: "rgba(242,239,233,0.06)",
                        color: "rgba(242,239,233,0.7)",
                        border: "1px solid rgba(242,239,233,0.08)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────── CONNECT ──────────────────────────────── */}
      <section
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 12rem) clamp(1.25rem, 5vw, 4rem) clamp(4rem, 8vh, 6rem)",
        }}
      >
        <header
          data-reveal
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.4fr) minmax(0, 1fr)",
            gap: "clamp(2rem, 5vw, 5rem)",
            marginBottom: "clamp(3rem, 7vh, 5rem)",
            alignItems: "end",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242,239,233,0.5)",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(242,239,233,0.2)",
            }}
          >
            <div>04 — Connect</div>
            <div style={{ marginTop: "0.5rem", color: "rgba(242,239,233,0.3)" }}>
              Say hi
            </div>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(2.4rem, 6.5vw, 6rem)",
                fontFamily: "var(--font-satoshi), system-ui, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "#f5f1e8",
              }}
            >
              Let&rsquo;s make{" "}
              <span
                style={{
                  fontFamily: "var(--font-sacramento), cursive",
                  fontWeight: 400,
                  fontSize: "1.1em",
                  color: "#e8c07d",
                  letterSpacing: "0",
                }}
              >
                something
              </span>
              <br />
              together.
            </h2>
            <p
              style={{
                marginTop: "1.5rem",
                maxWidth: 520,
                color: "rgba(242,239,233,0.6)",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              Punya ide, proyek, atau sekadar mau ngobrol soal kopi dan detail
              kecil yang bikin interface terasa beda? Kirim pesan — saya akan
              balas dengan senang hati.
            </p>
          </div>
        </header>

        <div
          data-reveal
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1px",
            background: "rgba(242,239,233,0.08)",
            border: "1px solid rgba(242,239,233,0.08)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          {connects.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  background: "#0d0d0d",
                  minHeight: 220,
                  transition: "background 0.4s ease",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(232,192,125,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0d0d0d";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      border: "1px solid rgba(242,239,233,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f5f1e8",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:rotate-0 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{
                      color: "rgba(242,239,233,0.4)",
                      transform: "rotate(-45deg)",
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-geist-mono), ui-monospace, monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(242,239,233,0.45)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)",
                      fontWeight: 700,
                      color: "#f5f1e8",
                      letterSpacing: "-0.01em",
                      marginBottom: "0.5rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {c.handle}
                  </div>
                  <div
                    style={{
                      color: "rgba(242,239,233,0.5)",
                      fontSize: "0.85rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {c.note}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer strip */}
        <div
          data-reveal
          style={{
            marginTop: "clamp(4rem, 8vh, 6rem)",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(242,239,233,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(242,239,233,0.4)",
          }}
        >
          <span>© 2026 — Ilham Lamiore</span>
          <span
            style={{
              fontFamily: "var(--font-sacramento), cursive",
              fontSize: "1.6rem",
              letterSpacing: 0,
              textTransform: "none",
              color: "#e8c07d",
            }}
          >
            thanks for scrolling —
          </span>
          <span>Bandung · ID</span>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
