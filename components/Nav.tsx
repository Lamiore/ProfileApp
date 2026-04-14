"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition";

const NAV_ITEMS = ["About", "Blog", "Gallery", "Connect"] as const;

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
                style={{ gap: "clamp(0.75rem, 2vw, 1.5rem)" }}
            >
                {NAV_ITEMS.map((name) => {
                    const path = `/${name.toLowerCase()}`;
                    const isActive = pathname === path;
                    return (
                        <button
                            key={name}
                            onClick={() => navigateTo(path)}
                            className="nav-flip font-bold tracking-wide text-white transition-colors duration-150"
                            style={{
                                fontSize: "clamp(0.92rem, 1.55vw, 1.25rem)",
                                letterSpacing: "clamp(0.02em, 0.08vw, 0.08em)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "4px",
                            }}
                        >
                            <span className="nav-flip-text" aria-hidden="true">
                                {name.toLowerCase().split("").map((char, index) => (
                                    <span
                                        key={`${name}-${index}`}
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
                                    background: "white",
                                    transformOrigin: "left",
                                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
