"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition";

const NAV_ITEMS = [
    { name: "About", color: "#ff8c00" },
    { name: "Blog", color: "#d0ff2c" },
    { name: "Gallery", color: "#c50022" }
] as const;

export default function Nav() {
    const pathname = usePathname();
    const { navigateTo } = usePageTransition();

    return (
        <nav
            style={{
                paddingInline: "clamp(1rem, 2.6vw, 2.5rem)",
                paddingTop: "clamp(1rem, 2.6vw, 2.5rem)",
            }}
        >
            <div
                className="flex w-full items-center justify-between"
                style={{ gap: "clamp(1rem, 3vw, 2.5rem)" }}
            >
                {NAV_ITEMS.map((item) => {
                    const name = item.name;
                    const path = `/${name.toLowerCase()}`;
                    const isActive = pathname === path;
                    const targetPath = isActive ? "/" : path;
                    return (
                        <button
                            key={name}
                            onClick={() => navigateTo(targetPath)}
                            className="nav-flip font-bold tracking-wide transition-colors duration-300"
                            style={{
                                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                                letterSpacing: "clamp(0.04em, 0.1vw, 0.1em)",
                                color: isActive ? item.color : "white",
                                ["--hover-color" as any]: item.color,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = item.color;
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.color = "white";
                            }}
                        >
                            <span className="nav-flip-text" aria-hidden="true">
                                {name.toLowerCase().split("").map((char, index) => (
                                    <span
                                        key={index}
                                        className="nav-flip-char"
                                        data-char={char}
                                        style={{ "--ci": index } as React.CSSProperties}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                            <span className="sr-only">{name.toLowerCase()}</span>
                            <span
                                aria-hidden="true"
                                style={{
                                    display: "block",
                                    height: "2px",
                                    width: "100%",
                                    background: "currentColor",
                                    transformOrigin: "left",
                                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease",
                                    willChange: "transform",
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
