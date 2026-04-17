"use client";

import { Search } from "lucide-react";
import { usePageTransition } from "@/components/layout/PageTransition";
import { useBlogPosts } from "../hooks/use-blog-posts";
import BlogCard, { SkeletonCard } from "./BlogCard";

export default function BlogWindow() {
    const { loading, searchQuery, setSearchQuery, filteredBlogs } = useBlogPosts();
    const { navigateTo } = usePageTransition();

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
                        {filteredBlogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                post={blog}
                                onClick={() => navigateTo(`/blog/${blog.id}`)}
                            />
                        ))}
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
