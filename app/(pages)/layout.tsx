"use client";

import { useEffect } from "react";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
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
        <div className="paper-texture" style={{ display: "flex", flexDirection: "column", minHeight: "100%", backgroundColor: "#0d0d0d" }}>
            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
