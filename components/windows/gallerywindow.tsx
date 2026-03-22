"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Window from "@/components/window";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MIN_COL_WIDTH = 160; // px per column minimum

const getCols = (width: number) => {
    return Math.max(2, Math.floor(width / MIN_COL_WIDTH));
};

// ---------- YouTube helpers ----------
function getYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        // youtube.com/watch?v=ID
        if (
            (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") &&
            u.pathname === "/watch"
        ) {
            return u.searchParams.get("v");
        }
        // youtu.be/ID
        if (u.hostname === "youtu.be") {
            return u.pathname.slice(1) || null;
        }
        // youtube.com/shorts/ID
        if (
            (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") &&
            u.pathname.startsWith("/shorts/")
        ) {
            return u.pathname.split("/shorts/")[1]?.split("?")[0] || null;
        }
        // youtube.com/embed/ID
        if (
            (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") &&
            u.pathname.startsWith("/embed/")
        ) {
            return u.pathname.split("/embed/")[1]?.split("?")[0] || null;
        }
    } catch {
        return null;
    }
    return null;
}

function isYouTubeUrl(url: string): boolean {
    return getYouTubeId(url) !== null;
}

function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ---------- Google Drive helpers ----------
function getGDriveId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname === "drive.google.com" && u.pathname.includes("/file/d/")) {
            const match = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            return match ? match[1] : null;
        }
    } catch {
        return null;
    }
    return null;
}

// ---------- Gallery item type ----------
interface GalleryItem {
    url: string;
    type: "image" | "youtube" | "gdrive";
    videoId?: string;
}

const CACHE_KEY = "gallery_items_v1";

function loadCache(): GalleryItem[] {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCache(items: GalleryItem[]) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    } catch { /* storage full — ignore */ }
}

function parseItems(docs: { data: () => Record<string, string> }[]): GalleryItem[] {
    return docs
        .map((doc) => {
            const url = doc.data().url;
            if (!url) return null;
            const ytId = getYouTubeId(url);
            if (ytId) return { url, type: "youtube" as const, videoId: ytId };
            const gDriveId = getGDriveId(url);
            if (gDriveId) return { url, type: "gdrive" as const, videoId: gDriveId };
            return { url, type: "image" as const };
        })
        .filter(Boolean) as GalleryItem[];
}

export default function GalleryWindow() {
    const [items, setItems] = useState<GalleryItem[]>(() => loadCache());
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [previewSize, setPreviewSize] = useState({ w: 560, h: 480 });
    const [cols, setCols] = useState(4);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(collection(db, "images"), orderBy("createdAt", "desc"));
        const onFresh = (snap: { docs: { data: () => Record<string, string> }[] }) => {
            const fresh = parseItems(snap.docs);
            setItems(fresh);
            saveCache(fresh);
        };

        let fallbackUnsub: (() => void) | null = null;
        const unsubscribe = onSnapshot(q, onFresh, (error) => {
            console.error("Error fetching images, falling back to unordered:", error);
            fallbackUnsub = onSnapshot(collection(db, "images"), onFresh);
        });
        return () => { unsubscribe(); fallbackUnsub?.(); };
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        let rafId: number;
        const ro = new ResizeObserver(([entry]) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                setCols(getCols(entry.contentRect.width));
            });
        });
        ro.observe(el);
        setCols(getCols(el.offsetWidth));
        return () => { ro.disconnect(); cancelAnimationFrame(rafId); };
    }, []);

    const gap = cols <= 2 ? 16 : 24;
    const previewItem = previewIndex !== null ? items[previewIndex] ?? null : null;

    // Compute preview window size for a given item
    const computeSize = useCallback((item: GalleryItem, onDone: (w: number, h: number) => void) => {
        const maxW = window.innerWidth * 0.8;
        const maxH = window.innerHeight * 0.8;
        const titleBarH = 48;

        if (item.type === "youtube" || item.type === "gdrive") {
            let w = 854;
            let h = 480 + titleBarH;
            if (w > maxW) { const s = maxW / w; w = maxW; h = 480 * s + titleBarH; }
            if (h > maxH) { const s = (maxH - titleBarH) / (h - titleBarH); h = maxH; w *= s; }
            onDone(Math.round(Math.max(420, w)), Math.round(Math.max(300, h)));
        } else {
            const img = new Image();
            img.onload = () => {
                let w = img.naturalWidth;
                let h = img.naturalHeight + titleBarH;
                if (w > maxW) { const s = maxW / w; w = maxW; h = img.naturalHeight * s + titleBarH; }
                if (h > maxH) { const s = (maxH - titleBarH) / (h - titleBarH); h = maxH; w *= s; }
                onDone(Math.round(Math.max(360, w)), Math.round(Math.max(280, h)));
            };
            img.src = item.url;
        }
    }, []);

    const openPreview = useCallback((item: GalleryItem) => {
        const idx = items.indexOf(item);
        computeSize(item, (w, h) => {
            setPreviewSize({ w, h });
            setPreviewIndex(idx);
        });
    }, [items, computeSize]);

    const goTo = useCallback((idx: number) => {
        if (idx < 0 || idx >= items.length) return;
        const item = items[idx];
        computeSize(item, (w, h) => {
            setPreviewSize({ w, h });
            setPreviewIndex(idx);
        });
    }, [items, computeSize]);

    const goPrev = useCallback(() => { if (previewIndex !== null) goTo(previewIndex - 1); }, [previewIndex, goTo]);
    const goNext = useCallback(() => { if (previewIndex !== null) goTo(previewIndex + 1); }, [previewIndex, goTo]);

    // Keyboard navigation
    useEffect(() => {
        if (previewIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
            if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
            if (e.key === "Escape") { e.preventDefault(); setPreviewIndex(null); }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [previewIndex, goPrev, goNext]);

    return (
        <>
            {/* Masonry grid */}
            <div
                ref={containerRef}
                style={{
                    columnCount: cols,
                    columnGap: `${gap}px`,
                    width: "100%",
                }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={item.url}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35 }}
                        onClick={() => openPreview(item)}
                        style={{
                            breakInside: "avoid",
                            marginBottom: `${gap}px`,
                            borderRadius: "8px",
                            overflow: "hidden",
                            cursor: "pointer",
                            position: "relative",
                        }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <img
                            src={
                                item.type === "youtube" && item.videoId
                                    ? getYouTubeThumbnail(item.videoId)
                                    : item.type === "gdrive" && item.videoId
                                        ? `https://drive.google.com/thumbnail?id=${item.videoId}&sz=w800`
                                        : item.url
                            }
                            alt={
                                item.type === "youtube" || item.type === "gdrive"
                                    ? `Video ${i + 1}`
                                    : `Gallery ${i + 1}`
                            }
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "auto",
                                pointerEvents: "none",
                            }}
                            loading="lazy"
                        />

                        {/* Video play button overlay */}
                        {(item.type === "youtube" || item.type === "gdrive") && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                                    pointerEvents: "none",
                                }}
                            >
                                {/* Play icon */}
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 68 48"
                                    style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
                                >
                                    <path
                                        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                                        fill={item.type === "youtube" ? "#FF0000" : "#4285F4"}
                                    />
                                    <path d="M45 24L27 14v20" fill="#fff" />
                                </svg>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Preview — popup Window via portal */}
            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {previewItem && (
                            <>
                            {/* Backdrop — click to close preview */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setPreviewIndex(null)}
                                style={{
                                    position: "fixed",
                                    inset: 0,
                                    zIndex: 99,
                                }}
                            />
                            <Window
                                title={
                                    previewItem.type === "youtube" || previewItem.type === "gdrive"
                                        ? "Video Player"
                                        : `Preview — ${(previewIndex ?? 0) + 1} / ${items.length}`
                                }
                                onClose={() => setPreviewIndex(null)}
                                zIndex={100}
                                initialWidth={previewSize.w}
                                initialHeight={previewSize.h}
                            >
                                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                    {previewItem.type === "youtube" && previewItem.videoId ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${previewItem.videoId}?autoplay=1&rel=0`}
                                            title="YouTube Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                borderRadius: "6px",
                                            }}
                                        />
                                    ) : previewItem.type === "gdrive" && previewItem.videoId ? (
                                        <iframe
                                            src={`https://drive.google.com/file/d/${previewItem.videoId}/preview`}
                                            title="Google Drive Video"
                                            allow="autoplay"
                                            allowFullScreen
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                borderRadius: "6px",
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={previewItem.url}
                                            alt="Preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                display: "block",
                                                borderRadius: "6px",
                                            }}
                                        />
                                    )}

                                    {/* Prev button */}
                                    {previewIndex !== null && previewIndex > 0 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                            style={{
                                                position: "absolute",
                                                left: "8px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                background: "rgba(0,0,0,0.5)",
                                                backdropFilter: "blur(8px)",
                                                border: "1px solid rgba(255,255,255,0.15)",
                                                color: "#E0E0E0",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "background 0.2s, transform 0.2s",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Next button */}
                                    {previewIndex !== null && previewIndex < items.length - 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                                            style={{
                                                position: "absolute",
                                                right: "8px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                background: "rgba(0,0,0,0.5)",
                                                backdropFilter: "blur(8px)",
                                                border: "1px solid rgba(255,255,255,0.15)",
                                                color: "#E0E0E0",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "background 0.2s, transform 0.2s",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </Window>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}
