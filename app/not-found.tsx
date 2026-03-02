"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <>
            <style>{`
                .nf-body {
                    background: #0a0a0a;
                    color: #ededed;
                    font-family: "Courier New", Courier, monospace;
                    font-size: 17px;
                    line-height: 1.7em;
                    cursor: default;
                    margin: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .code-area {
                    width: 420px;
                    min-width: 280px;
                }

                .code-area > span {
                    display: block;
                }

                .code-area a {
                    color: #ededed;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    transition: opacity 0.2s;
                }

                .code-area a:hover {
                    opacity: 0.45;
                }

                @media screen and (max-width: 480px) {
                    .code-area {
                        font-size: 4vw;
                        min-width: auto;
                        width: 90%;
                        line-height: 6.5vw;
                    }
                }
            `}</style>

            <div className="nf-body">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.svg
                            width="140"
                            height="140"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M20 90C20 90 25 80 35 90C45 100 55 80 65 90C75 100 80 90 80 90V45C80 28.4315 66.5685 15 50 15C33.4315 15 20 28.4315 20 45V90Z"
                                fill="rgba(237, 237, 237, 0.03)"
                                stroke="#52525b"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            {/* Eyes blinking */}
                            <motion.circle
                                cx="35" cy="45" r="4" fill="#a1a1aa"
                                animate={{ scaleY: [1, 0, 1] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], repeatDelay: 1 }}
                                style={{ transformOrigin: "35px 45px" }}
                            />
                            <motion.circle
                                cx="65" cy="45" r="4" fill="#a1a1aa"
                                animate={{ scaleY: [1, 0, 1] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], repeatDelay: 1 }}
                                style={{ transformOrigin: "65px 45px" }}
                            />
                            <ellipse cx="50" cy="65" rx="6" ry="8" fill="#52525b" opacity="0.8" />
                        </motion.svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        <h1 style={{ fontSize: "2rem", fontWeight: "normal", color: "#ededed", margin: 0, letterSpacing: "0.05em" }}>
                            404 Not Found
                        </h1>
                        <p style={{ color: "#a1a1aa", margin: 0, fontSize: "1rem" }}>
                            <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", borderBottom: "1px dashed #52525b", paddingBottom: "2px", transition: "color 0.2s, borderColor 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#ededed"; e.currentTarget.style.borderColor = "#a1a1aa"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "#52525b"; }}
                            >
                                kembali ke realita →
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}