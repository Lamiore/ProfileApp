"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <>
            <style>{`
                .nf-body {
                    background: #F5F5F0;
                    color: #1a1a1a;
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
                    color: #2C2C2C;
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
                <motion.div
                    className="code-area"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span>&nbsp;</span>

                    <span>
                        <span style={{ color: "#444444" }}>const</span>
                        {" "}
                        <span style={{ color: "#1a1a1a", fontStyle: "italic" }}>page</span>
                        {" = "}
                        <span style={{ color: "#444444" }}>await</span>
                        {" "}
                        <span style={{ color: "#1a1a1a" }}>find</span>
                        {"("}
                        <span style={{ color: "#555555", fontStyle: "italic" }}>url</span>
                        {");"}
                    </span>

                    <span>&nbsp;</span>

                    <span>
                        <span style={{ color: "#444444" }}>if</span>
                        {" (page === "}
                        <span style={{ color: "#555555", fontStyle: "italic" }}>null</span>
                        {") {"}
                    </span>

                    <span style={{ paddingLeft: "20px" }}>
                        <span style={{ color: "#444444" }}>console</span>
                        {"."}
                        <span style={{ color: "#1a1a1a" }}>warn</span>
                        {"("}
                        <span style={{ color: "#555555" }}>
                            &quot;halaman ini belum kubangun 🛠️&quot;
                        </span>
                        {");"}
                    </span>

                    <span style={{ paddingLeft: "20px" }}>
                        <span style={{ color: "#444444" }}>return</span>
                        {" ("}
                        <span style={{ color: "#555555", fontStyle: "italic" }}>
                            &quot;404 — lost in the void&quot;
                        </span>
                        {");"}
                    </span>

                    <span>{"}"}</span>

                    <span>&nbsp;</span>

                    <span style={{ color: "#666666", fontStyle: "italic" }}>
                        {"// ✦ "}
                        <Link href="/">kembali ke realita →</Link>
                    </span>
                </motion.div>
            </div>
        </>
    );
}