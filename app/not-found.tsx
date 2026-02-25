"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&display=swap');

                .nf-wrapper {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    font-family: 'Arvo', serif;
                }

                @keyframes nf-float {
                    0%, 100% { transform: translateY(0px) rotate(-3deg); }
                    50%       { transform: translateY(-18px) rotate(3deg); }
                }
                .nf-astronaut {
                    animation: nf-float 4s ease-in-out infinite;
                    transform-origin: center;
                }

                @keyframes nf-blink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.1; }
                }
                .nf-s1 { animation: nf-blink 2.1s ease-in-out infinite; }
                .nf-s2 { animation: nf-blink 1.7s ease-in-out infinite 0.5s; }
                .nf-s3 { animation: nf-blink 2.5s ease-in-out infinite 1s; }
                .nf-s4 { animation: nf-blink 1.4s ease-in-out infinite 0.2s; }

                @keyframes nf-orbit {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .nf-orbit-g {
                    transform-origin: 170px 200px;
                    animation: nf-orbit 8s linear infinite;
                }

                @keyframes nf-pulse {
                    0%, 100% { opacity: 0.07; }
                    50%      { opacity: 0.13; }
                }
                .nf-404-bg { animation: nf-pulse 3s ease-in-out infinite; }

                .nf-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 24px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
                    color: #2C2C2C;
                    text-decoration: none;
                    font-size: 13px;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    font-weight: 700;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    font-family: 'Arvo', serif;
                    cursor: pointer;
                }
                .nf-btn:hover {
                    background: rgba(255, 255, 255, 0.45);
                    transform: scale(1.05);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
                }
                .nf-btn:active {
                    transform: scale(0.96);
                }
            `}</style>

            <div className="nf-wrapper">
                <canvas
                    ref={canvasRef}
                    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                />

                <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "24px" }}>
                    {/* Error label */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{
                            fontSize: "11px",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "rgba(44,44,44,0.4)",
                            margin: "0 0 6px",
                            fontFamily: "'Arvo', serif",
                        }}
                    >
                        // Error
                    </motion.p>

                    {/* Animated SVG Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ margin: "0 auto 4px", width: 340, height: 270 }}
                    >
                        <svg
                            viewBox="0 0 340 270"
                            width="340"
                            height="270"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="404 Lost in Space"
                        >
                            <defs>
                                <radialGradient id="nf-pg" cx="38%" cy="32%" r="62%">
                                    <stop offset="0%" stopColor="rgba(44,44,44,0.18)" />
                                    <stop offset="100%" stopColor="rgba(44,44,44,0.04)" />
                                </radialGradient>
                                <radialGradient id="nf-hg" cx="35%" cy="30%" r="60%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                                    <stop offset="100%" stopColor="rgba(44,44,44,0.0)" />
                                </radialGradient>
                            </defs>

                            {/* Stars */}
                            <circle className="nf-s1" cx="18" cy="25" r="2" fill="#2C2C2C" opacity="0.5" />
                            <circle className="nf-s2" cx="305" cy="18" r="1.5" fill="#2C2C2C" opacity="0.4" />
                            <circle className="nf-s3" cx="315" cy="230" r="2" fill="#2C2C2C" opacity="0.5" />
                            <circle className="nf-s4" cx="12" cy="210" r="1.5" fill="#2C2C2C" opacity="0.4" />
                            <circle className="nf-s1" cx="55" cy="250" r="1" fill="#2C2C2C" opacity="0.3" />
                            <circle className="nf-s3" cx="285" cy="85" r="1" fill="#2C2C2C" opacity="0.3" />
                            <circle className="nf-s2" cx="128" cy="12" r="1.5" fill="#2C2C2C" opacity="0.35" />
                            <circle className="nf-s4" cx="245" cy="255" r="1" fill="#2C2C2C" opacity="0.3" />
                            <circle className="nf-s1" cx="80" cy="10" r="1" fill="#2C2C2C" opacity="0.25" />
                            <circle className="nf-s3" cx="260" cy="10" r="1.5" fill="#2C2C2C" opacity="0.3" />

                            {/* 404 ghost text */}
                            <text
                                className="nf-404-bg"
                                x="170" y="148"
                                textAnchor="middle"
                                fontSize="118"
                                fontWeight="700"
                                fontFamily="'Arvo', serif"
                                fill="#2C2C2C"
                                letterSpacing="-4"
                            >
                                404
                            </text>

                            {/* Planet */}
                            <circle cx="170" cy="210" r="42" fill="url(#nf-pg)" stroke="rgba(44,44,44,0.18)" strokeWidth="1.5" />
                            <circle cx="157" cy="202" r="7" fill="rgba(44,44,44,0.07)" stroke="rgba(44,44,44,0.10)" strokeWidth="1" />
                            <circle cx="183" cy="218" r="4.5" fill="rgba(44,44,44,0.05)" stroke="rgba(44,44,44,0.08)" strokeWidth="1" />
                            <circle cx="164" cy="222" r="3" fill="rgba(44,44,44,0.06)" />
                            <circle cx="182" cy="200" r="2" fill="rgba(44,44,44,0.05)" />

                            {/* Dashed shadow ellipse */}
                            <ellipse cx="170" cy="232" rx="78" ry="20" fill="none" stroke="rgba(44,44,44,0.10)" strokeWidth="1.5" strokeDasharray="5 4" />

                            {/* Spinning orbit */}
                            <g className="nf-orbit-g">
                                <ellipse cx="170" cy="200" rx="100" ry="26" fill="none" stroke="rgba(44,44,44,0.10)" strokeWidth="1" />
                                <circle cx="270" cy="200" r="5.5" fill="rgba(44,44,44,0.25)" />
                            </g>

                            {/* Astronaut */}
                            <g className="nf-astronaut">
                                {/* Tether */}
                                <path d="M150 128 Q122 150 105 170" stroke="rgba(44,44,44,0.22)" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
                                {/* Arms */}
                                <rect x="126" y="106" width="24" height="13" rx="6.5" fill="#2C2C2C" transform="rotate(20 138 112)" />
                                <rect x="190" y="106" width="24" height="13" rx="6.5" fill="#2C2C2C" transform="rotate(-20 202 112)" />
                                {/* Body */}
                                <rect x="146" y="100" width="48" height="52" rx="14" fill="#2C2C2C" />
                                <rect x="154" y="108" width="15" height="22" rx="5" fill="rgba(255,255,255,0.10)" />
                                <circle cx="158" cy="134" r="2" fill="rgba(255,255,255,0.25)" />
                                <circle cx="164" cy="134" r="2" fill="rgba(255,255,255,0.15)" />
                                {/* Legs */}
                                <rect x="149" y="146" width="15" height="24" rx="7" fill="#2C2C2C" transform="rotate(6 156 158)" />
                                <rect x="169" y="146" width="15" height="24" rx="7" fill="#2C2C2C" transform="rotate(-6 176 158)" />
                                <ellipse cx="155" cy="170" rx="8" ry="4" fill="rgba(44,44,44,0.6)" transform="rotate(6 155 170)" />
                                <ellipse cx="176" cy="170" rx="8" ry="4" fill="rgba(44,44,44,0.6)" transform="rotate(-6 176 170)" />
                                {/* Jetpack */}
                                <rect x="188" y="104" width="13" height="30" rx="5" fill="rgba(44,44,44,0.65)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                <ellipse cx="194" cy="138" rx="4" ry="6" fill="rgba(44,44,44,0.3)">
                                    <animate attributeName="ry" values="6;3;6" dur="0.45s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.45s" repeatCount="indefinite" />
                                </ellipse>
                                {/* Helmet */}
                                <circle cx="170" cy="87" r="24" fill="#2C2C2C" />
                                <circle cx="170" cy="87" r="18" fill="rgba(245,240,232,0.12)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                                <ellipse cx="163" cy="80" rx="5.5" ry="3.5" fill="rgba(255,255,255,0.18)" transform="rotate(-25 163 80)" />
                                <ellipse cx="175" cy="77" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.10)" transform="rotate(-25 175 77)" />
                                <circle cx="170" cy="87" r="24" fill="url(#nf-hg)" />
                            </g>
                        </svg>
                    </motion.div>

                    {/* Heading */}
                    <motion.h3
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#2C2C2C",
                            margin: "0 0 6px",
                            fontFamily: "'Arvo', serif",
                        }}
                    >
                        Look like you&apos;re lost
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.65 }}
                        style={{
                            fontSize: "15px",
                            color: "rgba(44,44,44,0.55)",
                            margin: "4px 0 32px",
                            lineHeight: 1.6,
                            fontFamily: "'Arvo', serif",
                        }}
                    >
                        Halaman yang kamu cari nggak ada.<br />
                        Mungkin nyasar, atau memang belum dibuat.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Link href="/" className="nf-btn">
                            ← Kembali ke Home
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
}