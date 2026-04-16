"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/PageTransition";
import { FileText, Search } from "lucide-react";

interface BlogBlock {
    id: number;
    type: "text" | "image";
    content: string;
}

interface Blog {
    id: string;
    title: string;
    blocks?: BlogBlock[];
    thumbnail?: string;
    createdAt?: { toDate: () => Date };
}

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
};

const getExcerpt = (blocks?: BlogBlock[]) => {
    const textBlock = blocks?.find((block) => block.type === "text" && block.content.trim());
    if (!textBlock) return "Buka artikel untuk membaca selengkapnya.";

    const normalized = textBlock.content.replace(/\s+/g, " ").trim();
    return normalized.length > 110 ? `${normalized.slice(0, 107)}...` : normalized;
};

function SkeletonCard() {
    return (
        <div
            className="wnd-blog-card"
            style={{ cursor: "default", pointerEvents: "none" }}
        >
            <div
                className="wnd-blog-card-backdrop"
                style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                    animation: "skeleton-pulse 1.8s ease-in-out infinite",
                }}
            />
            <div className="wnd-blog-card-content" style={{ zIndex: 2 }}>
                <div style={{
                    width: "72px",
                    height: "10px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.08)",
                    animation: "skeleton-pulse 1.8s ease-in-out infinite",
                }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                    <div style={{
                        width: "85%",
                        height: "14px",
                        borderRadius: "4px",
                        background: "rgba(255,255,255,0.1)",
                        animation: "skeleton-pulse 1.8s ease-in-out 0.1s infinite",
                    }} />
                    <div style={{
                        width: "60%",
                        height: "14px",
                        borderRadius: "4px",
                        background: "rgba(255,255,255,0.07)",
                        animation: "skeleton-pulse 1.8s ease-in-out 0.2s infinite",
                    }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "10px" }}>
                    <div style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "3px",
                        background: "rgba(255,255,255,0.05)",
                        animation: "skeleton-pulse 1.8s ease-in-out 0.3s infinite",
                    }} />
                    <div style={{
                        width: "70%",
                        height: "8px",
                        borderRadius: "3px",
                        background: "rgba(255,255,255,0.04)",
                        animation: "skeleton-pulse 1.8s ease-in-out 0.4s infinite",
                    }} />
                </div>
            </div>
        </div>
    );
}

export default function BlogWindow() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { navigateTo } = usePageTransition();

    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filteredBlogs = useMemo(() => {
        if (!searchQuery.trim()) return blogs;
        const q = searchQuery.toLowerCase();
        return blogs.filter((blog) => 
            blog.title.toLowerCase().includes(q) || 
            blog.blocks?.some(b => b.type === "text" && b.content.toLowerCase().includes(q))
        );
    }, [blogs, searchQuery]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                <Search 
                    size={16} 
                    style={{ 
                        position: "absolute", 
                        left: "12px", 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        color: "rgba(255,255,255,0.4)" 
                    }} 
                />
                <input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 12px 10px 38px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        outline: "none",
                        transition: "all 0.2s ease"
                    }}
                    className="wnd-blog-search"
                />
            </div>
            {loading ? (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ width: "90px", height: "13px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", animation: "skeleton-pulse 1.8s ease-in-out infinite" }} />
                        <div style={{ width: "55px", height: "12px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", animation: "skeleton-pulse 1.8s ease-in-out 0.1s infinite" }} />
                    </div>
                    <div className="wnd-blog-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            ) : filteredBlogs.length > 0 ? (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0" }}>
                            {searchQuery ? `Hasil pencarian: ${filteredBlogs.length}` : "Semua Blog"}
                        </span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{filteredBlogs.length} artikel</span>
                    </div>
                    <div className="wnd-blog-grid">
                        {filteredBlogs.map((blog) => {
                            const excerpt = getExcerpt(blog.blocks);

                            return (
                                <article
                                    key={blog.id}
                                    className="wnd-blog-card"
                                    onClick={() => navigateTo(`/blog/${blog.id}`)}
                                >
                                    {blog.thumbnail ? (
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            referrerPolicy="no-referrer"
                                            className="wnd-blog-card-backdrop"
                                        />
                                    ) : (
                                        <div className="wnd-blog-card-thumb-empty wnd-blog-card-backdrop">
                                            <FileText size={26} />
                                        </div>
                                    )}
                                    <div className="wnd-blog-card-content">
                                        <div className="wnd-blog-card-category">{formatDate(blog.createdAt) || "Artikel"}</div>
                                        <h3 className="wnd-blog-card-title">{blog.title}</h3>
                                        <div className="wnd-blog-card-description">
                                            <p>{excerpt}</p>
                                            <span aria-hidden="true">
                                                <svg viewBox="0 -960 960 960" fill="currentColor">
                                                    <path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "4rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                    {searchQuery 
                        ? `Tidak ada hasil untuk "${searchQuery}"`
                        : "Belum ada tulisan yang dipublikasikan."}
                </div>
            )}
        </div>
    );
}
