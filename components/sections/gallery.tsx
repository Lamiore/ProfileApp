"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Masonry, { type MasonryItem } from "@/components/ui/masonry";

function useIsMobile() {
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const check = () => setMobile(window.innerWidth <= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return mobile;
}

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
    const isMobile = useIsMobile();

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

    const previewItem = previewIndex !== null ? items[previewIndex] ?? null : null;
    const latestNavRef = useRef<number>(-1);

    // Convert GalleryItems to MasonryItems — memoized so reference only changes when items change
    const masonryItems: MasonryItem[] = useMemo(() => items.map((item) => ({
        id: item.url,
        img:
            item.type === "youtube" && item.videoId
                ? getYouTubeThumbnail(item.videoId)
                : item.type === "gdrive" && item.videoId
                ? `https://drive.google.com/thumbnail?id=${item.videoId}&sz=w800`
                : item.url,
        url: item.url,
        height: 400,
    })), [items]);

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
        latestNavRef.current = idx;
        computeSize(item, (w, h) => {
            if (latestNavRef.current !== idx) return;
            setPreviewSize({ w, h });
            setPreviewIndex(idx);
        });
    }, [items, computeSize]);

    const goTo = useCallback((idx: number) => {
        if (idx < 0 || idx >= items.length) return;
        latestNavRef.current = idx;
        const item = items[idx];
        computeSize(item, (w, h) => {
            if (latestNavRef.current !== idx) return;
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
            <Masonry
                items={masonryItems}
                ease="power3.out"
                duration={0.6}
                stagger={0.05}
                animateFrom="bottom"
                scaleOnHover
                hoverScale={0.95}
                blurToFocus
                colorShiftOnHover={false}
                onItemClick={(masonryItem) => {
                    const item = items.find((g) => g.url === masonryItem.url);
                    if (item) openPreview(item);
                }}
            />

            {/* Preview — mobile: fullscreen overlay, desktop: popup Window */}
            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {previewItem && isMobile ? (
                            /* ── Mobile: lightweight fullscreen preview ── */
                            <motion.div
                                key="mobile-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "fixed",
                                    inset: 0,
                                    zIndex: 200,
                                    background: "#0d0d0d",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Header */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "12px 16px",
                                    flexShrink: 0,
                                }}>
                                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                                        {previewItem.type === "youtube" || previewItem.type === "gdrive"
                                            ? "Video"
                                            : `${(previewIndex ?? 0) + 1} / ${items.length}`}
                                    </span>
                                    <button
                                        onClick={() => setPreviewIndex(null)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "4px",
                                            display: "flex",
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Content */}
                                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                    {previewItem.type === "youtube" && previewItem.videoId ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${previewItem.videoId}?autoplay=1&rel=0`}
                                            title="YouTube Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                        />
                                    ) : previewItem.type === "gdrive" && previewItem.videoId ? (
                                        <iframe
                                            src={`https://drive.google.com/file/d/${previewItem.videoId}/preview`}
                                            title="Google Drive Video"
                                            allow="autoplay"
                                            allowFullScreen
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                        />
                                    ) : (
                                        <img
                                            src={previewItem.url}
                                            alt="Preview"
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                                        />
                                    )}

                                    {/* Nav buttons */}
                                    {previewIndex !== null && previewIndex > 0 && (
                                        <button onClick={(e) => { e.stopPropagation(); goPrev(); }} style={{
                                            position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                                            width: "40px", height: "40px", borderRadius: "50%",
                                            background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                                            color: "#E0E0E0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                        </button>
                                    )}
                                    {previewIndex !== null && previewIndex < items.length - 1 && (
                                        <button onClick={(e) => { e.stopPropagation(); goNext(); }} style={{
                                            position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                                            width: "40px", height: "40px", borderRadius: "50%",
                                            background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                                            color: "#E0E0E0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : previewItem ? (
                            /* ── Desktop: centered modal preview ── */
                            <>
                            <motion.div
                                key="desktop-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setPreviewIndex(null)}
                                style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                            />
                            <motion.div
                                key={previewIndex}
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    position: "fixed",
                                    zIndex: 100,
                                    width: `${previewSize.w}px`,
                                    height: `${previewSize.h}px`,
                                    left: `calc(50% - ${previewSize.w / 2}px)`,
                                    top: `calc(50% - ${previewSize.h / 2}px)`,
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    background: "rgba(26,26,26,0.75)",
                                    backdropFilter: "blur(40px) saturate(180%)",
                                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Title bar */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "14px 16px",
                                    borderBottom: "1px solid rgba(44,44,44,0.1)",
                                    background: "rgba(26,26,26,0.4)",
                                    flexShrink: 0,
                                    gap: "8px",
                                }}>
                                    <button
                                        onClick={() => setPreviewIndex(null)}
                                        style={{
                                            width: "14px", height: "14px", borderRadius: "50%",
                                            background: "#FF5F57", border: "none", cursor: "pointer", flexShrink: 0,
                                        }}
                                    />
                                    <span style={{
                                        flex: 1, textAlign: "center", fontSize: "13px", fontWeight: 500,
                                        color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em",
                                    }}>
                                        {previewItem.type === "youtube" || previewItem.type === "gdrive"
                                            ? "Video Player"
                                            : `Preview — ${(previewIndex ?? 0) + 1} / ${items.length}`}
                                    </span>
                                    <div style={{ width: "14px", flexShrink: 0 }} />
                                </div>

                                {/* Content */}
                                <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
                                    {previewItem.type === "youtube" && previewItem.videoId ? (
                                        <iframe
                                            key={previewItem.url}
                                            src={`https://www.youtube.com/embed/${previewItem.videoId}?autoplay=1&rel=0`}
                                            title="YouTube Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                        />
                                    ) : previewItem.type === "gdrive" && previewItem.videoId ? (
                                        <iframe
                                            key={previewItem.url}
                                            src={`https://drive.google.com/file/d/${previewItem.videoId}/preview`}
                                            title="Google Drive Video"
                                            allow="autoplay"
                                            allowFullScreen
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                        />
                                    ) : (
                                        <img key={previewItem.url} src={previewItem.url} alt="Preview"
                                            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                                    )}

                                    {previewIndex !== null && previewIndex > 0 && (
                                        <button onClick={(e) => { e.stopPropagation(); goPrev(); }} style={{
                                            position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                                            width: "36px", height: "36px", borderRadius: "50%",
                                            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                                            border: "1px solid rgba(255,255,255,0.15)", color: "#E0E0E0", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                        </button>
                                    )}
                                    {previewIndex !== null && previewIndex < items.length - 1 && (
                                        <button onClick={(e) => { e.stopPropagation(); goNext(); }} style={{
                                            position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                                            width: "36px", height: "36px", borderRadius: "50%",
                                            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                                            border: "1px solid rgba(255,255,255,0.15)", color: "#E0E0E0", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                            </>
                        ) : null}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}
