"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Window from "@/components/window";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MIN_COL_WIDTH = 160; // px per column minimum

const getCols = (width: number) => {
    return Math.max(2, Math.floor(width / MIN_COL_WIDTH));
};

export default function GalleryWindow() {
    const [images, setImages] = useState<string[]>([]);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewSize, setPreviewSize] = useState({ w: 560, h: 480 });
    const [cols, setCols] = useState(4);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(collection(db, "images"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedImages = snapshot.docs
                    .map((doc) => doc.data().url)
                    .filter(Boolean);
                setImages(fetchedImages);
            },
            (error) => {
                console.error("Error fetching images, falling back to unordered:", error);
                // Fallback in case orderBy fails (e.g. missing index)
                onSnapshot(collection(db, "images"), (snap) => {
                    const fetchedImages = snap.docs
                        .map((doc) => doc.data().url)
                        .filter(Boolean);
                    setImages(fetchedImages);
                });
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setCols(getCols(entry.contentRect.width));
        });
        ro.observe(el);
        setCols(getCols(el.offsetWidth));
        return () => ro.disconnect();
    }, []);

    const gap = cols <= 2 ? 16 : 24;

    // Preload image → get natural size → calculate window size to fit
    const openPreview = (src: string) => {
        const img = new Image();
        img.onload = () => {
            const maxW = window.innerWidth * 0.8;
            const maxH = window.innerHeight * 0.8;
            const titleBarH = 48;

            let w = img.naturalWidth;
            let h = img.naturalHeight + titleBarH;

            // Scale down to fit viewport
            if (w > maxW) {
                const scale = maxW / w;
                w = maxW;
                h = img.naturalHeight * scale + titleBarH;
            }
            if (h > maxH) {
                const scale = (maxH - titleBarH) / (h - titleBarH);
                h = maxH;
                w = w * scale;
            }

            // Minimum size
            w = Math.max(360, w);
            h = Math.max(280, h);

            setPreviewSize({ w: Math.round(w), h: Math.round(h) });
            setPreviewSrc(src);
        };
        img.src = src;
    };

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
                {images.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.35 }}
                        onClick={() => openPreview(src)}
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
                            src={src}
                            alt={`Gallery ${i + 1}`}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "auto",
                                pointerEvents: "none",
                            }}
                            loading="lazy"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Preview — popup Window via portal, sized to image */}
            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {previewSrc && (
                            <Window
                                title="Preview"
                                onClose={() => setPreviewSrc(null)}
                                zIndex={100}
                                initialWidth={previewSize.w}
                                initialHeight={previewSize.h}
                            >
                                <img
                                    src={previewSrc}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        display: "block",
                                        borderRadius: "6px",
                                    }}
                                />
                            </Window>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}
