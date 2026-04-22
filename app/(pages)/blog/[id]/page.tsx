"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/layout/PageTransition";

type BlockType = "text" | "heading" | "quote" | "list" | "code" | "image" | "divider";

interface BlogBlock {
    type: BlockType | string;
    content: string;
    meta?: string;
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

const countWords = (blocks?: BlogBlock[]) => {
    if (!blocks) return 0;
    return blocks
        .filter((b) => b.type === "text" || b.type === "heading" || b.type === "quote" || b.type === "list")
        .reduce((sum, b) => sum + b.content.trim().split(/\s+/).filter(Boolean).length, 0);
};

function BlockRenderer({ block }: { block: BlogBlock }) {
    switch (block.type) {
        case "heading":
            return block.meta === "h3"
                ? <h3>{block.content}</h3>
                : <h2>{block.content}</h2>;

        case "quote":
            return (
                <blockquote>
                    <p>{block.content}</p>
                    {block.meta?.trim() && <cite>— {block.meta}</cite>}
                </blockquote>
            );

        case "list": {
            const items = block.content.split("\n").map((l) => l.trim()).filter(Boolean);
            const isNumbered = block.meta === "numbered";
            return isNumbered
                ? <ol>{items.map((it, i) => <li key={i}>{it}</li>)}</ol>
                : <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
        }

        case "code":
            return (
                <pre>
                    {block.meta?.trim() && <span className="blog-detail-code-lang">{block.meta}</span>}
                    <code>{block.content}</code>
                </pre>
            );

        case "image":
            return (
                <figure>
                    <img src={block.content} alt={block.meta || ""} referrerPolicy="no-referrer" />
                    {block.meta?.trim() && <figcaption>{block.meta}</figcaption>}
                </figure>
            );

        case "divider":
            return (
                <hr className="blog-detail-divider" aria-hidden="true" />
            );

        case "text":
        default:
            return <p>{block.content}</p>;
    }
}

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { navigateTo } = usePageTransition();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [prevBlog, setPrevBlog] = useState<{ id: string; title: string } | null>(null);
    const [nextBlog, setNextBlog] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        if (!id) return;
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
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        };
        onScroll();
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

    const firstImageIndex = blog?.blocks?.findIndex(b => b.type === "image") ?? -1;
    const wordCount = countWords(blog?.blocks);
    const readingMinutes = Math.max(1, Math.round(wordCount / 200));

    return (
        <div className="journal-detail" style={{
            width: "100%",
            minHeight: "100vh",
        }}>
            {/* Reading progress */}
            <div className="blog-detail-progress" aria-hidden="true">
                <div className="blog-detail-progress-bar" style={{ transform: `scaleX(${progress})` }} />
            </div>

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
                    onClick={() => navigateTo("/blog")}
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
                                background: "linear-gradient(to top, #0d0d0d 0%, transparent 100%)",
                                pointerEvents: "none",
                            }} />
                        </div>
                    )}

                    {/* ── Article ── */}
                    <article className={`blog-detail-article ${heroImage ? "blog-detail-article-offset" : "blog-detail-article-pad"}`}>
                        {/* Meta */}
                        <div className="blog-detail-meta">
                            {blog.createdAt && <time>{formatDate(blog.createdAt)}</time>}
                            {blog.createdAt && <span className="blog-detail-meta-dot" aria-hidden="true" />}
                            <span>{readingMinutes} min read</span>
                        </div>

                        {/* Title */}
                        <h1 className="blog-detail-title">{blog.title}</h1>

                        {/* Divider */}
                        <div className="blog-detail-title-rule" aria-hidden="true" />

                        {/* Content blocks */}
                        <div className="blog-detail-content">
                            {blog.blocks?.map((block, i) => {
                                // Skip the first image if it's already used as the hero
                                if (
                                    block.type === "image" &&
                                    block.content === heroImage &&
                                    i === firstImageIndex
                                ) {
                                    return null;
                                }

                                // Skip empty content blocks (except divider)
                                if (block.type !== "divider" && !block.content.trim()) {
                                    return null;
                                }

                                return <BlockRenderer key={i} block={block} />;
                            })}
                        </div>
                    </article>

                    {/* ── Prev / Next navigation ── */}
                    {(prevBlog || nextBlog) && (
                        <nav style={{ maxWidth: "680px", margin: "0 auto", padding: "0 28px 60px" }}>
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
