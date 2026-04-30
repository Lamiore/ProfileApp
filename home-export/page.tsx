"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

const Origin = dynamic(() => import("@/components/home/Origin"));
const Moodboard = dynamic(() => import("@/components/home/Moodboard"));
const Marquee = dynamic(() => import("@/components/home/Marquee"));
const Skills = dynamic(() => import("@/components/home/Skills"));
const Contact = dynamic(() => import("@/components/home/Contact"));

export default function Home() {
  const name = "ilham mohammad";
  const role = "graphic designer / video editor";

  return (
    <main className="home-root paper-texture">
      <Hero name={name} role={role} />
      <Origin />
      <Moodboard />
      <Marquee />
      <Skills />
      <Contact name={name} />
    </main>
  );
}
