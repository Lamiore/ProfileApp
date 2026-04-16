"use client";

import dynamic from "next/dynamic";
import AboutText from "@/components/ui/about-text";
import { LogoLoop } from "@/components/ui/logo-loop";
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
} from "lucide-react";

const Keyboard = dynamic(() => import("@/components/ui/keyboard"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.2)",
      }}
    >
      Loading 3D Model...
    </div>
  ),
});

const logos = [
  { node: <Figma size={24} />, title: "Figma" },
  { node: <Github size={24} />, title: "GitHub" },
  { node: <Code size={24} />, title: "Code" },
  { node: <Palette size={24} />, title: "Design" },
  { node: <Layers size={24} />, title: "Layers" },
  { node: <Monitor size={24} />, title: "Desktop" },
  { node: <Smartphone size={24} />, title: "Mobile" },
  { node: <Globe size={24} />, title: "Web" },
  { node: <Zap size={24} />, title: "Performance" },
  { node: <PenTool size={24} />, title: "Creative" },
];

const works = [
  {
    title: "Personal Portfolio",
    description: "A creative portfolio with 3D elements and smooth animations.",
    tags: ["Next.js", "Three.js", "GSAP"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    span: "col-span-2 row-span-2",
  },
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with modern UI and seamless checkout.",
    tags: ["React", "TypeScript", "Tailwind"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Dashboard Analytics",
    description: "Real-time data visualization dashboard with interactive charts.",
    tags: ["Next.js", "D3.js", "Firebase"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Mobile App",
    description: "Cross-platform mobile app with native feel and performance.",
    tags: ["React Native", "Firebase"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Brand Identity",
    description: "Complete branding from logo to digital presence.",
    tags: ["Figma", "Branding"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
    span: "col-span-2 row-span-1",
  },
];

export default function AboutPage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#0d0d0d",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(100px, 15vh, 160px) 6vw 10vh",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Keyboard />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1,
              color: "white",
              fontFamily: "Helvetica, Arial, sans-serif",
              letterSpacing: "-0.05em",
            }}
          >
            ABOUT
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.35rem)",
              color: "rgba(255,255,255,0.5)",
              marginTop: "1.2rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Designer & Developer — Based in Indonesia
          </p>

          {/* Description */}
          <div style={{ marginTop: "clamp(2rem, 5vh, 4rem)" }}>
            <AboutText />
          </div>
        </div>
      </section>

      {/* Logo Loop Divider */}
      <section
        style={{
          padding: "4vh 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.35)" }}>
          <LogoLoop
            logos={logos}
            speed={80}
            logoHeight={24}
            gap={48}
            pauseOnHover
            fadeOut
            fadeOutColor="#0d0d0d"
          />
        </div>
      </section>

      {/* Work Section — Bento Grid */}
      <section
        style={{
          padding: "15vh 6vw 20vh",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 800,
            color: "white",
            fontFamily: "Helvetica, Arial, sans-serif",
            letterSpacing: "-0.03em",
            marginBottom: "4rem",
          }}
        >
          Selected Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] gap-4">
          {works.map((work, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-pointer transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] ${work.span.replace("col-span-2", "md:col-span-2").replace("col-span-1", "md:col-span-1").replace("row-span-2", "md:row-span-2").replace("row-span-1", "md:row-span-1")}`}
            >
              {/* Image */}
              <img
                src={work.image}
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    fontWeight: 700,
                    color: "white",
                    margin: "0 0 0.35rem 0",
                    fontFamily: "Helvetica, Arial, sans-serif",
                  }}
                >
                  {work.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed m-0 mb-3">
                  {work.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white/60 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
