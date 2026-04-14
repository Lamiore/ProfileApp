"use client";

import { useEffect } from "react";
import Nav from "@/components/Nav";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    // Root layout sets body to height:100dvh + overflow:hidden (needed for hero grid).
    // Sub-pages need window scrolling so window.scrollY works (sticky headers, scroll-to-top).
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        const prevHeight = document.body.style.height;
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.height = prevHeight;
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", backgroundColor: "#2c2c2c" }}>
            {/* Sticky Frame Overlay - fixed to viewport, creates the rounded corners look */}
            <div 
                style={{ 
                    position: "fixed", 
                    inset: "24px", 
                    pointerEvents: "none", 
                    zIndex: 9999, 
                    borderRadius: "2rem",
                    boxShadow: "0 0 0 100vmax #171717", 
                }} 
            />

            <header 
                style={{ 
                    position: "sticky", 
                    top: 0, 
                    zIndex: 100, 
                    backgroundColor: "rgba(44, 44, 44, 0.6)", 
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
            >
                <Nav />
                <div style={{ height: "clamp(1rem, 2vw, 1.5rem)" }} /> {/* Extra spacing below nav items */}
            </header>
            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
