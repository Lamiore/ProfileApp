"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { usePageTransition } from "@/components/layout/PageTransition";
import { useBlogPosts } from "../hooks/use-blog-posts";
import BlogCard, { SkeletonCard } from "./BlogCard";

const PAGE_SIZE = 9;

export default function BlogWindow() {
    const { loading, searchQuery, setSearchQuery, filteredBlogs } = useBlogPosts();
    const { navigateTo } = usePageTransition();
    const [page, setPage] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);

    const isSearching = searchQuery.trim().length > 0;

    // Focus with "/" shortcut
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

    // reset pager when searching
    useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    const total = filteredBlogs.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages - 1);
    const pagePosts = filteredBlogs.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE
    );

    return (
        <div className="journal-root">
            <section className="j-hero">
                <h1 className="j-hero-title">JOURNAL</h1>
                <div className="j-hero-sub">
                    <p>
                        Notes, teardowns, and small essays about design, video, and building
                        things slower than the internet demands. No newsletter popups. No
                        upsells. Just words I wish someone had written for me a few years
                        back.
                    </p>
                    <div className="j-hero-meta">
                        <div>
                            <b>{loading ? "—" : String(total).padStart(2, "0")}</b> posts
                        </div>
                        <div style={{ marginTop: 6 }}>EST. 2023</div>
                    </div>
                </div>

                <div className="j-search">
                    <Search size={14} className="j-search-icon" aria-hidden />
                    <input
                        ref={searchRef}
                        type="text"
                        className="j-search-input"
                        placeholder="Search by title, category, or content"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search articles"
                    />
                    {isSearching ? (
                        <button
                            type="button"
                            className="j-search-clear"
                            aria-label="Clear search"
                            onClick={() => {
                                setSearchQuery("");
                                searchRef.current?.focus();
                            }}
                        >
                            <X size={12} />
                        </button>
                    ) : (
                        <kbd className="j-search-hint" aria-hidden>/</kbd>
                    )}
                </div>
            </section>

            {loading ? (
                <div className="j-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : total === 0 ? (
                <div className="j-empty">
                    <div className="j-empty-eyebrow">
                        {isSearching ? "No results" : "Nothing yet"}
                    </div>
                    <p className="j-empty-text">
                        {isSearching ? (
                            <>
                                Nothing matched <strong>&ldquo;{searchQuery}&rdquo;</strong>.
                                Try a different keyword.
                            </>
                        ) : (
                            <>The journal is quiet for now — new writings land here soon.</>
                        )}
                    </p>
                </div>
            ) : (
                <>
                    <div className="j-grid">
                        {pagePosts.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                post={blog}
                                onClick={() => navigateTo(`/blog/${blog.id}`)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="j-pager">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                            >
                                ← Prev
                            </button>
                            <div className="j-page-num">
                                <b>{String(currentPage + 1).padStart(2, "0")}</b> /{" "}
                                {String(totalPages).padStart(2, "0")}
                            </div>
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            <footer className="j-footer">
                <div>© {new Date().getFullYear()} Ilham Mohammad · All Rights Reserved</div>
                <div>
                    <a href="https://instagram.com/ikanguramegarorica" target="_blank" rel="noreferrer">
                        Instagram
                    </a>
                    <a href="https://linkedin.com/in/irham-aadiyaat-mohammad" target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                </div>
            </footer>
        </div>
    );
}
