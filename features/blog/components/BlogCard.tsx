"use client";

import { FileText } from "lucide-react";
import type { BlogPost, BlogBlock } from "../types";

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getExcerpt = (blocks: BlogBlock[] | undefined, max = 110) => {
    const textBlock = blocks?.find((block) => block.type === "text" && block.content.trim());
    if (!textBlock) return "Open the article to read more.";

    const normalized = textBlock.content.replace(/\s+/g, " ").trim();
    return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
};

const getReadingMinutes = (blocks?: BlogBlock[]) => {
    const words = (blocks ?? [])
        .filter((b) => b.type === "text")
        .reduce((sum, b) => sum + b.content.trim().split(/\s+/).filter(Boolean).length, 0);
    return Math.max(1, Math.round(words / 200));
};

interface BlogCardProps {
    post: BlogPost;
    onClick?: () => void;
}

export function SkeletonCard() {
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

export default function BlogCard({ post, onClick }: BlogCardProps) {
    const excerpt = getExcerpt(post.blocks);
    const date = formatDate(post.createdAt);
    const minutes = getReadingMinutes(post.blocks);

    return (
        <article
            className="wnd-blog-card"
            onClick={onClick}
        >
            {post.thumbnail ? (
                <img
                    src={post.thumbnail}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="wnd-blog-card-backdrop"
                />
            ) : (
                <div className="wnd-blog-card-thumb-empty wnd-blog-card-backdrop">
                    <FileText size={26} />
                </div>
            )}
            <div className="wnd-blog-card-content">
                <div className="wnd-blog-card-category">
                    <span>{date || "Article"}</span>
                    <span className="wnd-blog-card-dot" aria-hidden="true" />
                    <span>{minutes} min</span>
                </div>
                <h3 className="wnd-blog-card-title">{post.title}</h3>
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
}
