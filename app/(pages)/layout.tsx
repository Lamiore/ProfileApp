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
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            <Nav />
            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
