"use client";

import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import Origin from "@/components/home/Origin";
import Moodboard from "@/components/home/Moodboard";
import Marquee from "@/components/home/Marquee";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";

export default function Home() {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevHeight = document.body.style.height;
    const prevBackground = document.body.style.background;
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.body.style.background = "#2a2a2a";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.height = prevHeight;
      document.body.style.background = prevBackground;
    };
  }, []);

  const name = "ilham mohammad";
  const role = "graphic designer / video editor";

  return (
    <main className="home-root home-paper">
      <Hero name={name} role={role} />
      <Origin />
      <Moodboard />
      <Marquee />
      <Skills />
      <Contact name={name} />
    </main>
  );
}
