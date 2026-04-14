"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/PageTransition";

interface BlogBlock {
    type: "text" | "image";
    content: string;
}

interface Blog {
    title: string;
    thumbnail?: string;
    blocks?: BlogBlock[];
    createdAt?: { toDate: () => Date };
}

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { navigateTo } = usePageTransition();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [prevBlog, setPrevBlog] = useState<{ id: string; title: string } | null>(null);
    const [nextBlog, setNextBlog] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        if (!id) return;
        // Fetch current blog + all blog IDs for prev/next
        Promise.all([
            getDoc(doc(db, "blogs", id)),
            getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc"))),
        ]).then(([snap, allSnap]) => {
            if (snap.exists()) setBlog(snap.data() as Blog);
            const allBlogs = allSnap.docs.map(d => ({ id: d.id, title: (d.data().title as string) || d.id }));
            const idx = allBlogs.findIndex(b => b.id === id);
            setPrevBlog(idx > 0 ? allBlogs[idx - 1] : null);
            setNextBlog(idx < allBlogs.length - 1 ? allBlogs[idx + 1] : null);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.documentElement.classList.add("blog-detail-scroll-hidden");
        document.body.classList.add("blog-detail-scroll-hidden");

        return () => {
            document.documentElement.classList.remove("blog-detail-scroll-hidden");
            document.body.classList.remove("blog-detail-scroll-hidden");
        };
    }, []);

    const heroImage = blog?.thumbnail
        || blog?.blocks?.find(b => b.type === "image" && b.content.trim())?.content
        || null;

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
                <div style={{ textAlign: "center", padding: "8rem 1rem", color: "rgba(212,212,212,0.3)", fontSize: "14px", letterSpacing: "0.03em" }}>
                    Memuat...
                </div>
            ) : !blog ? (
                <div style={{ textAlign: "center", padding: "8rem 1rem", color: "rgba(212,212,212,0.3)", fontSize: "14px", letterSpacing: "0.03em" }}>
                    Blog tidak ditemukan.
                </div>
            ) : (
                <>
                    {/* ── Hero image ── */}
                    {heroImage && (
                        <div style={{ position: "relative", width: "100%", maxHeight: "72vh", overflow: "hidden" }}>
                            <img
                                src={heroImage}
                                alt={blog.title}
                                referrerPolicy="no-referrer"
                                style={{ width: "100%", height: "auto", maxHeight: "72vh", objectFit: "cover", display: "block" }}
                            />
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "45%",
                                background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
                                pointerEvents: "none",
                            }} />
                        </div>
                    )}

                    {/* ── Article ── */}
                    <article style={{
                        maxWidth: "640px",
                        margin: heroImage ? "-60px auto 0" : "0 auto",
                        padding: heroImage ? "0 28px 80px" : "100px 28px 80px",
                        position: "relative",
                        zIndex: 1,
                    }}>
                        {/* Meta date */}
                        <div style={{ marginBottom: "20px" }}>
                            <time style={{
                                fontSize: "12px",
                                fontWeight: 400,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase" as const,
                                color: "rgba(212,212,212,0.35)",
                            }}>
                                {formatDate(blog.createdAt)}
                            </time>
                        </div>

                        {/* Title — serif */}
                        <h1 style={{
                            fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif",
                            fontSize: "clamp(28px, 5vw, 42px)",
                            fontWeight: 400,
                            lineHeight: 1.25,
                            letterSpacing: "-0.01em",
                            color: "#e8e8e8",
                            margin: "0 0 28px",
                        }}>
                            {blog.title}
                        </h1>

                        {/* Divider */}
                        <div style={{ width: "48px", height: "1px", background: "rgba(212,212,212,0.15)", marginBottom: "36px" }} />

                        {/* Content blocks */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                            {blog.blocks?.map((block, i) => {
                                // Skip the first image if it's already used as hero
                                if (
                                    block.type === "image" &&
                                    block.content === heroImage &&
                                    i === (blog.blocks?.findIndex(b => b.type === "image") ?? -1)
                                ) {
                                    return null;
                                }

                                return block.type === "image" ? (
                                    <figure key={i} style={{ margin: "12px 0", padding: 0 }}>
                                        <img
                                            src={block.content}
                                            alt=""
                                            referrerPolicy="no-referrer"
                                            style={{ width: "100%", borderRadius: "4px", display: "block" }}
                                        />
                                    </figure>
                                ) : (
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
                    </article>

                    {/* ── Prev / Next navigation ── */}
                    {(prevBlog || nextBlog) && (
                        <nav style={{ maxWidth: "640px", margin: "0 auto", padding: "0 28px 60px" }}>
                            <div style={{ width: "100%", height: "1px", background: "rgba(212,212,212,0.08)", marginBottom: "32px" }} />
                            <div style={{
                                display: "flex",
                                justifyContent: prevBlog && nextBlog ? "space-between" : prevBlog ? "flex-start" : "flex-end",
                                gap: "24px",
                            }}>
                                {prevBlog && (
                                    <button
                                        onClick={() => { navigateTo(`/blog/${prevBlog.id}`); window.scrollTo(0, 0); }}
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
                                            color: "rgba(212,212,212,0.3)",
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
                                            {prevBlog.title}
                                        </span>
                                    </button>
                                )}
                                {nextBlog && (
                                    <button
                                        onClick={() => { navigateTo(`/blog/${nextBlog.id}`); window.scrollTo(0, 0); }}
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
                                            color: "rgba(212,212,212,0.3)",
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
                                            {nextBlog.title}
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
