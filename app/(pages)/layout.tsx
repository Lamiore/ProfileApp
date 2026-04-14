"use client";

import { useEffect } from "react";
import Nav from "@/components/Nav";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    // Root layout sets body to height:100dvh + overflow:hidden (needed for hero grid).
    // Sub-pages need window scrolling so window.scrollY works (sticky headers, scroll-to-top).
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        const prevHeight = document.body.style.height;
        const prevPadding = document.body.style.padding;
        const prevBackground = document.body.style.background;
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        document.body.style.padding = "0";
        document.body.style.background = "#0d0d0d";
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.height = prevHeight;
            document.body.style.padding = prevPadding;
            document.body.style.background = prevBackground;
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", backgroundColor: "#0d0d0d" }}>
<header 
                style={{ 
                    position: "sticky", 
                    top: 0, 
                    zIndex: 100, 
                    backgroundColor: "rgba(13, 13, 13, 0.6)", 
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
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
