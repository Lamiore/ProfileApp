"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { usePageTransition } from "@/components/layout/PageTransition";
import { useBlogPosts } from "../hooks/use-blog-posts";
import BlogCard, { SkeletonCard } from "./BlogCard";

export default function BlogWindow() {
    const { loading, searchQuery, setSearchQuery, filteredBlogs } = useBlogPosts();
    const { navigateTo } = usePageTransition();
    const searchRef = useRef<HTMLInputElement>(null);

    // Focus search with "/" shortcut — small designer touch
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
            const active = document.activeElement;
            const editing = active instanceof HTMLElement && (
                active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA" ||
                active.isContentEditable
            );
            if (editing) return;
            e.preventDefault();
            searchRef.current?.focus();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const isSearching = searchQuery.trim().length > 0;
    const gridPosts = filteredBlogs;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Toolbar: search + meta */}
            <div className="wnd-blog-toolbar">
                <div className="wnd-blog-search-field">
                    <Search size={15} />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search articles by title or content"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="wnd-blog-search"
                        aria-label="Search articles"
                    />
                    {isSearching ? (
                        <button
                            type="button"
                            className="wnd-blog-search-clear"
                            aria-label="Clear search"
                            onClick={() => {
                                setSearchQuery("");
                                searchRef.current?.focus();
                            }}
                        >
                            <X size={13} />
                        </button>
                    ) : (
                        <span className="wnd-blog-search-hint" aria-hidden="true">/</span>
                    )}
                </div>
                <div className="wnd-blog-meta">
                    {loading ? (
                        <span>Loading</span>
                    ) : isSearching ? (
                        <>
                            <span>{filteredBlogs.length} result{filteredBlogs.length === 1 ? "" : "s"}</span>
                        </>
                    ) : (
                        <>
                            <span>{filteredBlogs.length} article{filteredBlogs.length === 1 ? "" : "s"}</span>
                            <span className="wnd-blog-meta-dot" aria-hidden="true" />
                            <span>Latest first</span>
                        </>
                    )}
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <>
                    <div className="wnd-blog-section-head">
                        <span className="wnd-blog-section-label">Articles</span>
                        <span className="wnd-blog-section-rule" aria-hidden="true" />
                        <span className="wnd-blog-section-count">—</span>
                    </div>
                    <div className="wnd-blog-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </>
            ) : filteredBlogs.length === 0 ? (
                <div className="wnd-blog-empty">
                    <span className="wnd-blog-empty-eyebrow">
                        {isSearching ? "No results" : "Nothing yet"}
                    </span>
                    <p className="wnd-blog-empty-text">
                        {isSearching ? (
                            <>Nothing matched <strong>&ldquo;{searchQuery}&rdquo;</strong>. Try a different keyword.</>
                        ) : (
                            <>The journal is quiet for now — new writings land here soon.</>
                        )}
                    </p>
                </div>
            ) : (
                <>
                    {gridPosts.length > 0 && (
                        <>
                            <div className="wnd-blog-section-head">
                                <span className="wnd-blog-section-label">
                                    {isSearching ? "Results" : "Articles"}
                                </span>
                                <span className="wnd-blog-section-rule" aria-hidden="true" />
                                <span className="wnd-blog-section-count">
                                    {String(gridPosts.length).padStart(2, "0")}
                                </span>
                            </div>
                            <div className="wnd-blog-grid">
                                {gridPosts.map((blog) => (
                                    <BlogCard
                                        key={blog.id}
                                        post={blog}
                                        onClick={() => navigateTo(`/blog/${blog.id}`)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
