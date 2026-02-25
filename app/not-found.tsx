"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Animated SVG Astronaut Lost in Space
function LostAstronautSVG() {
    return (
        <svg
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", maxWidth: "420px", overflow: "visible" }}
        >
            <defs>
                <radialGradient id="spaceGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2C2C2C" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#2C2C2C" stopOpacity="0" />
                </radialGradient>
                <filter id="softShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2C2C2C" floodOpacity="0.12" />
                </filter>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(-3deg); }
                        50% { transform: translateY(-18px) rotate(3deg); }
                    }
                    @keyframes floatSlow {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes blink {
                        0%, 90%, 100% { opacity: 1; }
                        95% { opacity: 0; }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.3; r: 3; }
                        50% { opacity: 0.8; r: 5; }
                    }
                    @keyframes dash {
                        0% { stroke-dashoffset: 300; opacity: 0; }
                        20% { opacity: 1; }
                        100% { stroke-dashoffset: 0; opacity: 0.15; }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 1; }
                    }
                    .astronaut-group { animation: float 5s ease-in-out infinite; transform-origin: center; }
                    .planet-group { animation: floatSlow 7s ease-in-out infinite; transform-origin: center; }
                    .gear { animation: spin 8s linear infinite; transform-origin: 300px 220px; }
                    .gear2 { animation: spin 5s linear infinite reverse; transform-origin: 340px 250px; }
                    .visor-blink { animation: blink 4s ease-in-out infinite; }
                    .signal-line { animation: dash 3s ease-out infinite; stroke-dasharray: 300; }
                    .star1 { animation: twinkle 2s ease-in-out infinite; }
                    .star2 { animation: twinkle 3s ease-in-out infinite 0.5s; }
                    .star3 { animation: twinkle 2.5s ease-in-out infinite 1s; }
                    .star4 { animation: twinkle 1.8s ease-in-out infinite 0.3s; }
                `}</style>
            </defs>

            {/* Background glow */}
            <ellipse cx="200" cy="200" rx="180" ry="120" fill="url(#spaceGlow)" />

            {/* Stars */}
            <circle className="star1" cx="30" cy="40" r="2" fill="#2C2C2C" />
            <circle className="star2" cx="80" cy="20" r="1.5" fill="#2C2C2C" />
            <circle className="star3" cx="350" cy="30" r="2" fill="#2C2C2C" />
            <circle className="star4" cx="370" cy="80" r="1.5" fill="#2C2C2C" />
            <circle className="star1" cx="15" cy="130" r="1.5" fill="#2C2C2C" />
            <circle className="star3" cx="390" cy="150" r="2" fill="#2C2C2C" />
            <circle className="star2" cx="50" cy="260" r="1.5" fill="#2C2C2C" />
            <circle className="star4" cx="360" cy="240" r="2" fill="#2C2C2C" />

            {/* Signal wave from astronaut to planet (lost signal) */}
            <path
                className="signal-line"
                d="M 185 130 Q 230 80 300 100"
                fill="none"
                stroke="#2C2C2C"
                strokeWidth="1.5"
                strokeDasharray="5 4"
            />

            {/* Planet group */}
            <g className="planet-group">
                {/* Planet */}
                <circle cx="310" cy="105" r="38" fill="#2C2C2C" opacity="0.08" />
                <circle cx="310" cy="105" r="34" fill="none" stroke="#2C2C2C" strokeWidth="1.5" opacity="0.2" />
                {/* Planet rings */}
                <ellipse cx="310" cy="105" rx="50" ry="12" fill="none" stroke="#2C2C2C" strokeWidth="1.5" opacity="0.15" />
                {/* Planet craters */}
                <circle cx="300" cy="98" r="5" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.15" />
                <circle cx="318" cy="112" r="3.5" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.15" />
                <circle cx="305" cy="118" r="2.5" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.12" />
                {/* ? mark on planet */}
                <text x="310" y="112" textAnchor="middle" fontSize="22" fill="#2C2C2C" opacity="0.2" fontWeight="700">?</text>
            </g>

            {/* Astronaut group */}
            <g className="astronaut-group" filter="url(#softShadow)">
                {/* Jetpack */}
                <rect x="148" y="148" width="24" height="36" rx="5" fill="#2C2C2C" opacity="0.15" />
                <rect x="150" y="175" width="8" height="14" rx="3" fill="#2C2C2C" opacity="0.2" />
                <rect x="162" y="175" width="8" height="14" rx="3" fill="#2C2C2C" opacity="0.2" />

                {/* Body suit */}
                <rect x="158" y="150" width="44" height="50" rx="12" fill="#2C2C2C" opacity="0.12" />
                <rect x="160" y="152" width="40" height="46" rx="10" fill="none" stroke="#2C2C2C" strokeWidth="1.5" opacity="0.2" />

                {/* Chest panel */}
                <rect x="168" y="162" width="24" height="16" rx="4" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.2" />
                <circle cx="174" cy="168" r="2" fill="#2C2C2C" opacity="0.25" />
                <circle cx="180" cy="168" r="2" fill="#2C2C2C" opacity="0.15" />
                <circle cx="186" cy="168" r="2" fill="#2C2C2C" opacity="0.2" />

                {/* Left arm (reaching out) */}
                <rect x="125" y="155" width="36" height="16" rx="8" fill="#2C2C2C" opacity="0.13" transform="rotate(-25, 143, 163)" />
                {/* Left glove */}
                <ellipse cx="116" cy="172" rx="9" ry="7" fill="#2C2C2C" opacity="0.18" />

                {/* Right arm (down) */}
                <rect x="202" y="158" width="32" height="14" rx="7" fill="#2C2C2C" opacity="0.13" transform="rotate(20, 218, 165)" />
                {/* Right glove */}
                <ellipse cx="240" cy="170" rx="9" ry="7" fill="#2C2C2C" opacity="0.18" />

                {/* Legs */}
                <rect x="165" y="196" width="16" height="30" rx="7" fill="#2C2C2C" opacity="0.13" transform="rotate(-8, 173, 211)" />
                <rect x="183" y="196" width="16" height="30" rx="7" fill="#2C2C2C" opacity="0.13" transform="rotate(8, 191, 211)" />
                {/* Boots */}
                <ellipse cx="168" cy="226" rx="11" ry="6" fill="#2C2C2C" opacity="0.2" />
                <ellipse cx="193" cy="226" rx="11" ry="6" fill="#2C2C2C" opacity="0.2" />

                {/* Helmet */}
                <circle cx="180" cy="138" r="28" fill="#2C2C2C" opacity="0.1" />
                <circle cx="180" cy="138" r="26" fill="none" stroke="#2C2C2C" strokeWidth="2" opacity="0.2" />

                {/* Visor */}
                <ellipse className="visor-blink" cx="180" cy="138" rx="18" ry="16" fill="#2C2C2C" opacity="0.12" />
                <ellipse className="visor-blink" cx="180" cy="138" rx="16" ry="14" fill="none" stroke="#2C2C2C" strokeWidth="1" opacity="0.2" />

                {/* Eyes inside visor */}
                <circle cx="174" cy="136" r="3" fill="#2C2C2C" opacity="0.25" />
                <circle cx="186" cy="136" r="3" fill="#2C2C2C" opacity="0.25" />
                {/* Confused expression */}
                <path d="M 173 144 Q 180 141 187 144" fill="none" stroke="#2C2C2C" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
                {/* Sweat drop */}
                <path d="M 195 128 Q 197 122 199 128 Q 199 133 195 128" fill="#2C2C2C" opacity="0.15" />

                {/* Visor shine */}
                <ellipse cx="172" cy="130" rx="5" ry="4" fill="white" opacity="0.3" transform="rotate(-20, 172, 130)" />

                {/* Helmet collar */}
                <rect x="162" y="160" width="36" height="8" rx="4" fill="#2C2C2C" opacity="0.15" />

                {/* Tethered wire floating */}
                <path d="M 202 170 Q 240 140 270 160 Q 300 180 330 160" fill="none" stroke="#2C2C2C" strokeWidth="1.5" opacity="0.15" strokeDasharray="4 3" strokeLinecap="round" />
            </g>

            {/* Floating debris */}
            <g style={{ animation: "float 9s ease-in-out infinite 2s", transformOrigin: "60px 200px" }}>
                <rect x="50" y="190" width="14" height="10" rx="2" fill="none" stroke="#2C2C2C" strokeWidth="1.2" opacity="0.15" transform="rotate(20, 57, 195)" />
            </g>
            <g style={{ animation: "float 6s ease-in-out infinite 1s", transformOrigin: "350px 180px" }}>
                <rect x="340" y="170" width="10" height="8" rx="2" fill="none" stroke="#2C2C2C" strokeWidth="1.2" opacity="0.12" transform="rotate(-15, 345, 174)" />
            </g>

            {/* Shadow under astronaut */}
            <ellipse cx="190" cy="252" rx="42" ry="8" fill="#2C2C2C" opacity="0.05" />
        </svg>
    );
}

export default function NotFound() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.4 + 0.1,
        }));

        let rafId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(44,44,44,${p.alpha})`;
                ctx.fill();
            });
            rafId = requestAnimationFrame(animate);
        };
        animate();

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "#F5F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontFamily: "inherit",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0px",
                }}
            >
                {/* Label */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        fontSize: "12px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "#2C2C2C60",
                        margin: "0 0 8px",
                    }}
                >
                    //Error
                </motion.p>

                {/* 404 heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontSize: "clamp(5rem, 18vw, 11rem)",
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        color: "#2C2C2C",
                        margin: "0 0 4px",
                    }}
                >
                    404.
                </motion.h1>

                {/* Animated SVG Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: "100%", maxWidth: "380px", margin: "-16px 0 -8px" }}
                >
                    <LostAstronautSVG />
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    style={{
                        fontSize: "15px",
                        color: "#2C2C2C70",
                        margin: "0 0 32px",
                        lineHeight: 1.7,
                    }}
                >
                    Halaman yang kamu cari nggak ada.<br />
                    Mungkin nyasar, atau memang belum dibuat.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 28px",
                            borderRadius: "999px",
                            background: "rgba(44,44,44,0.08)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            WebkitBackdropFilter: "blur(20px) saturate(180%)",
                            border: "1px solid rgba(44,44,44,0.15)",
                            color: "#2C2C2C",
                            textDecoration: "none",
                            fontSize: "13px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                            transition: "background 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(44,44,44,0.14)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(44,44,44,0.08)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        ← Kembali ke Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}