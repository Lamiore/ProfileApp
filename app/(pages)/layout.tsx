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
        <div className="relative flex flex-col w-full h-full">
            <div className="absolute top-0 left-0 right-0" style={{ zIndex: 55 }}>
                <Nav />
            </div>
            <main
                style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingTop: "clamp(4rem, 8vw, 6rem)", // Offset for fixed nav
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
                className="blog-detail-scroll-hidden"
            >
                {children}
            </main>
        </div>
    );
}
