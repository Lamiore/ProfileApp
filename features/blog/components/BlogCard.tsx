"use client";

import Thumb from "./Thumb";
import type { BlogPost, BlogBlock } from "../types";

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "—";
    return ts.toDate()
        .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        .toUpperCase();
};

const getExcerpt = (blocks: BlogBlock[] | undefined, max = 160) => {
    const textBlock = blocks?.find((block) => block.type === "text" && block.content.trim());
    if (!textBlock) return "Open the article to read more.";
    const normalized = textBlock.content.replace(/\s+/g, " ").trim();
    return normalized.length > max ? `${normalized.slice(0, max - 1)}…` : normalized;
};

const getReadingMinutes = (blocks?: BlogBlock[]) => {
    const words = (blocks ?? [])
        .filter((b) => b.type === "text")
        .reduce((sum, b) => sum + b.content.trim().split(/\s+/).filter(Boolean).length, 0);
    return Math.max(1, Math.round(words / 200));
};

const hashSeed = (id: string) => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(h);
};

interface BlogCardProps {
    post: BlogPost;
    onClick?: () => void;
}

export function SkeletonCard() {
    return (
        <div className="j-card" style={{ cursor: "default", pointerEvents: "none" }}>
            <div className="j-card-top">
                <span style={{ width: 80, height: 8, background: "rgba(255,255,255,0.08)", animation: "skeleton-pulse 1.8s ease-in-out infinite" }} />
                <span style={{ width: 60, height: 20, borderRadius: 999, background: "rgba(255,255,255,0.06)", animation: "skeleton-pulse 1.8s ease-in-out infinite" }} />
            </div>
            <div className="j-card-thumb">
                <div
                    className="j-placeholder-fill"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                        animation: "skeleton-pulse 1.8s ease-in-out infinite",
                    }}
                />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
                <div style={{ width: "85%", height: 18, borderRadius: 4, background: "rgba(255,255,255,0.1)", animation: "skeleton-pulse 1.8s ease-in-out 0.1s infinite" }} />
                <div style={{ width: "60%", height: 18, borderRadius: 4, background: "rgba(255,255,255,0.08)", animation: "skeleton-pulse 1.8s ease-in-out 0.2s infinite" }} />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
                <div style={{ width: "100%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.05)", animation: "skeleton-pulse 1.8s ease-in-out 0.3s infinite" }} />
                <div style={{ width: "70%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.04)", animation: "skeleton-pulse 1.8s ease-in-out 0.4s infinite" }} />
            </div>
        </div>
    );
}

export default function BlogCard({ post, onClick }: BlogCardProps) {
    const excerpt = getExcerpt(post.blocks);
    const date = formatDate(post.createdAt);
    const minutes = getReadingMinutes(post.blocks);
    const seed = hashSeed(post.id);

    return (
        <button className="j-card" type="button" onClick={onClick}>
            <div className="j-card-top">
                <span>{date}</span>
                <span className="j-card-cat">{post.category || "Journal"}</span>
            </div>

            <div className="j-card-thumb">
                {post.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail} alt={post.title} referrerPolicy="no-referrer" />
                ) : (
                    <Thumb seed={seed} />
                )}
            </div>

            <h2 className="j-card-title">{post.title}</h2>
            <p className="j-card-excerpt">{excerpt}</p>

            <div className="j-card-bottom">
                <span>By Ilham · {minutes} min read</span>
                <span className="j-card-more">
                    Read More
                    <span className="j-card-more-arrow">→</span>
                </span>
            </div>
        </button>
    );
}
