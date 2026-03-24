"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/PageTransition";
import ImageComparison from "@/components/ImageComparison";

interface WorkBlock {
    type: "text" | "image" | "comparison";
    content: string;
}

interface Work {
    title: string;
    description?: string;
    imageUrl?: string;
    blocks?: WorkBlock[];
    createdAt?: { toDate: () => Date };
}

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

function parseComparison(content: string) {
    try {
        const data = JSON.parse(content);
        return {
            beforeUrl: data.beforeUrl || "",
            afterUrl: data.afterUrl || "",
            beforeLabel: data.beforeLabel || "Before",
            afterLabel: data.afterLabel || "After",
        };
    } catch {
        return null;
    }
}

/* Sage green accent */
const SAGE = "rgb(120, 150, 120)";
const SAGE_DIM = "rgba(120, 150, 120, 0.35)";

export default function WorkDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { navigateTo } = usePageTransition();
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [prevWork, setPrevWork] = useState<{ id: string; title: string } | null>(null);
    const [nextWork, setNextWork] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getDoc(doc(db, "works", id)),
            getDocs(query(collection(db, "works"), orderBy("createdAt", "desc"))),
        ]).then(([snap, allSnap]) => {
            if (snap.exists()) setWork(snap.data() as Work);
            const all = allSnap.docs.map(d => ({ id: d.id, title: (d.data().title as string) || d.id }));
            const idx = all.findIndex(w => w.id === id);
            setPrevWork(idx > 0 ? all[idx - 1] : null);
            setNextWork(idx < all.length - 1 ? all[idx + 1] : null);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div style={{
            width: "100%",
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#d4d4d4",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            WebkitFontSmoothing: "antialiased",
        }}>
            {/* ── Sticky header ── */}
            <header style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: scrolled ? "14px 28px" : "20px 28px",
                background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                transition: "all 0.3s ease",
                backdropFilter: scrolled ? "blur(12px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
            }}>
                <button
                    onClick={() => navigateTo("/")}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        fontWeight: 400,
                        letterSpacing: "0.02em",
                        color: scrolled ? "rgba(212,212,212,0.6)" : "rgba(255,255,255,0.9)",
                        filter: scrolled ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.7))",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "color 0.25s, filter 0.25s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = scrolled ? "rgba(212,212,212,0.6)" : "rgba(255,255,255,0.9)"; }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Kembali</span>
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", padding: "8rem 1rem", color: "rgba(212,212,212,0.3)", fontSize: "14px" }}>
                    Memuat...
                </div>
            ) : !work ? (
                <div style={{ textAlign: "center", padding: "8rem 1rem", color: "rgba(212,212,212,0.3)", fontSize: "14px" }}>
                    Work tidak ditemukan.
                </div>
            ) : (
                <>
                    {/* ── Hero cover image — full-bleed ── */}
                    {work.imageUrl && (
                        <div style={{ position: "relative", width: "100%", maxHeight: "72vh", overflow: "hidden" }}>
                            <img
                                src={work.imageUrl}
                                alt={work.title}
                                referrerPolicy="no-referrer"
                                style={{ width: "100%", height: "auto", maxHeight: "72vh", objectFit: "cover", display: "block" }}
                            />
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "50%",
                                background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
                                pointerEvents: "none",
                            }} />
                        </div>
                    )}

                    {/* ── Article content ── */}
                    <article style={{
                        maxWidth: "640px",
                        margin: work.imageUrl ? "-60px auto 0" : "0 auto",
                        padding: work.imageUrl ? "0 28px 80px" : "100px 28px 80px",
                        position: "relative",
                        zIndex: 1,
                    }}>
                        {/* Sage accent tag */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "18px",
                        }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: SAGE }} />
                            <span style={{
                                fontSize: "11px",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase" as const,
                                color: SAGE_DIM,
                                fontWeight: 500,
                            }}>
                                Project
                            </span>
                        </div>

                        {/* Title — serif */}
                        <h1 style={{
                            fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif",
                            fontSize: "clamp(28px, 5vw, 44px)",
                            fontWeight: 400,
                            lineHeight: 1.2,
                            letterSpacing: "-0.015em",
                            color: "#e8e8e8",
                            margin: "0 0 16px",
                        }}>
                            {work.title}
                        </h1>

                        {/* Date */}
                        <p style={{
                            fontSize: "12px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "rgba(212,212,212,0.3)",
                            margin: "0 0 32px",
                        }}>
                            {formatDate(work.createdAt)}
                        </p>

                        {/* Divider — sage accent */}
                        <div style={{ width: "48px", height: "2px", background: SAGE_DIM, marginBottom: "36px", borderRadius: "1px" }} />

                        {/* Description (legacy works without blocks) */}
                        {work.description && !work.blocks?.length && (
                            <p style={{
                                fontSize: "16px",
                                lineHeight: 1.85,
                                color: "rgba(212,212,212,0.78)",
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                fontWeight: 300,
                                letterSpacing: "0.01em",
                            }}>
                                {work.description}
                            </p>
                        )}

                        {/* Content blocks */}
                        {work.blocks && work.blocks.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                                {work.blocks.map((block, i) => {
                                    if (block.type === "comparison") {
                                        const cmp = parseComparison(block.content);
                                        if (!cmp || !cmp.beforeUrl || !cmp.afterUrl) return null;
                                        return (
                                            <ImageComparison
                                                key={i}
                                                beforeUrl={cmp.beforeUrl}
                                                afterUrl={cmp.afterUrl}
                                                beforeLabel={cmp.beforeLabel}
                                                afterLabel={cmp.afterLabel}
                                            />
                                        );
                                    }
                                    if (block.type === "image") {
                                        return (
                                            <figure key={i} style={{ margin: "8px 0", padding: 0 }}>
                                                <img
                                                    src={block.content}
                                                    alt=""
                                                    referrerPolicy="no-referrer"
                                                    style={{ width: "100%", borderRadius: "4px", display: "block" }}
                                                />
                                            </figure>
                                        );
                                    }
                                    return (
                                        <p key={i} style={{
                                            fontSize: "16px",
                                            lineHeight: 1.85,
                                            color: "rgba(212,212,212,0.78)",
                                            margin: 0,
                                            whiteSpace: "pre-wrap",
                                            fontWeight: 300,
                                            letterSpacing: "0.01em",
                                        }}>
                                            {block.content}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </article>

                    {/* ── Prev / Next navigation ── */}
                    {(prevWork || nextWork) && (
                        <nav style={{ maxWidth: "640px", margin: "0 auto", padding: "0 28px 60px" }}>
                            <div style={{ width: "100%", height: "1px", background: "rgba(212,212,212,0.08)", marginBottom: "32px" }} />
                            <div style={{
                                display: "flex",
                                justifyContent: prevWork && nextWork ? "space-between" : prevWork ? "flex-start" : "flex-end",
                                gap: "24px",
                            }}>
                                {prevWork && (
                                    <button
                                        onClick={() => { navigateTo(`/work/${prevWork.id}`); window.scrollTo(0, 0); }}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: "6px",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            maxWidth: "45%",
                                            textAlign: "left",
                                        }}
                                        onMouseEnter={e => {
                                            const t = e.currentTarget.querySelector("[data-title]") as HTMLElement;
                                            if (t) t.style.color = "#e8e8e8";
                                        }}
                                        onMouseLeave={e => {
                                            const t = e.currentTarget.querySelector("[data-title]") as HTMLElement;
                                            if (t) t.style.color = "rgba(212,212,212,0.6)";
                                        }}
                                    >
                                        <span style={{
                                            fontSize: "11px",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase" as const,
                                            color: SAGE_DIM,
                                        }}>
                                            ← Sebelumnya
                                        </span>
                                        <span data-title="" style={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "rgba(212,212,212,0.6)",
                                            transition: "color 0.25s",
                                            lineHeight: 1.4,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical" as const,
                                            overflow: "hidden",
                                        }}>
                                            {prevWork.title}
                                        </span>
                                    </button>
                                )}
                                {nextWork && (
                                    <button
                                        onClick={() => { navigateTo(`/work/${nextWork.id}`); window.scrollTo(0, 0); }}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            gap: "6px",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            maxWidth: "45%",
                                            textAlign: "right",
                                            marginLeft: "auto",
                                        }}
                                        onMouseEnter={e => {
                                            const t = e.currentTarget.querySelector("[data-title]") as HTMLElement;
                                            if (t) t.style.color = "#e8e8e8";
                                        }}
                                        onMouseLeave={e => {
                                            const t = e.currentTarget.querySelector("[data-title]") as HTMLElement;
                                            if (t) t.style.color = "rgba(212,212,212,0.6)";
                                        }}
                                    >
                                        <span style={{
                                            fontSize: "11px",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase" as const,
                                            color: SAGE_DIM,
                                        }}>
                                            Selanjutnya →
                                        </span>
                                        <span data-title="" style={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "rgba(212,212,212,0.6)",
                                            transition: "color 0.25s",
                                            lineHeight: 1.4,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical" as const,
                                            overflow: "hidden",
                                        }}>
                                            {nextWork.title}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}
