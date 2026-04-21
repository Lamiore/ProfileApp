"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ShopPlaceholder() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(rootRef);

            gsap.set(q(".shop-label"), { opacity: 0, x: -30 });
            gsap.set(q(".shop-title-line"), { opacity: 0, yPercent: 110 });
            gsap.set(q(".shop-note"), { opacity: 0, y: 20, rotate: -3 });
            gsap.set(q(".shop-stripe"), { opacity: 0, scaleX: 0 });
            gsap.set(q(".shop-foot"), { opacity: 0, y: 10 });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.to(q(".shop-label"), { opacity: 1, x: 0, duration: 0.7 })
                .to(
                    q(".shop-title-line"),
                    {
                        opacity: 1,
                        yPercent: 0,
                        duration: 1.1,
                        stagger: 0.18,
                        ease: "back.out(1.6)",
                    },
                    "-=0.3"
                )
                .to(
                    q(".shop-stripe"),
                    {
                        opacity: 1,
                        scaleX: 1,
                        duration: 0.9,
                        ease: "power2.out",
                    },
                    "-=0.5"
                )
                .to(
                    q(".shop-note"),
                    {
                        opacity: 1,
                        y: 0,
                        rotate: -3,
                        duration: 0.8,
                        ease: "back.out(1.8)",
                    },
                    "-=0.4"
                )
                .to(
                    q(".shop-foot"),
                    { opacity: 1, y: 0, duration: 0.6 },
                    "-=0.3"
                );
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={rootRef}
            className="home-root"
            style={{
                minHeight: "calc(100vh - 160px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                position: "relative",
                padding: "clamp(24px, 6vw, 60px)",
                gap: "28px",
                background: "transparent",
                overflow: "hidden",
            }}
        >
            <div
                className="section-label shop-label"
                style={{ marginBottom: 8 }}
            >
                🚧 under construction
            </div>

            <h1
                className="font-display"
                aria-label="Shop — coming soon"
                style={{
                    margin: 0,
                    fontSize: "clamp(72px, 16vw, 220px)",
                    lineHeight: 0.82,
                    color: "var(--accent)",
                    letterSpacing: "-0.04em",
                    textShadow: "0.06em 0.07em 0 var(--ink)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <span
                    className="shop-title-line"
                    style={{ display: "inline-block" }}
                >
                    the
                </span>
                <span
                    className="shop-title-line"
                    style={{ display: "inline-block" }}
                >
                    shop
                </span>
            </h1>

            <div
                className="shop-stripe"
                aria-hidden
                style={{
                    width: "min(420px, 80%)",
                    height: 14,
                    backgroundImage:
                        "repeating-linear-gradient(-45deg, var(--accent) 0 14px, var(--ink) 14px 28px)",
                    transformOrigin: "left center",
                    marginTop: 8,
                    boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
                }}
            />

            <div
                className="shop-note"
                style={{
                    fontFamily: "var(--font-caveat), 'Caveat', cursive",
                    fontWeight: 600,
                    fontSize: "clamp(26px, 3.2vw, 38px)",
                    color: "var(--ink)",
                    maxWidth: 620,
                    lineHeight: 1.25,
                    marginTop: 10,
                    transformOrigin: "center",
                }}
            >
                prints, zines, and a couple of very weird objects are almost
                ready — bear with me.
            </div>

            <div
                className="font-mono shop-foot"
                style={{
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginTop: 18,
                }}
            >
                check back soon · lamiore studio
            </div>
        </div>
    );
}
