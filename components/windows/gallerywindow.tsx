"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Window from "@/components/window";

const IMAGES = [
    "https://images.unsplash.com/photo-1770407779123-8523d311c4b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDcxMjV8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1768477007256-9a27fd44fc62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY2MzB8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770367214408-1b6bcacd6332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY2MzB8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770281151839-51fcd6c94439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MDh8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770283553813-238f9500551d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MDh8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770074051176-76dc5019be0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDcxODR8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1767968037382-8eb9c564339f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MzV8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770386085173-b7410ddc993c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MzV8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1765707886613-f4961bbd07dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4NTh8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1768430309142-632889e10e86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4NzN8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1769021488255-c58d0b4748f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY5MTR8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1768162125657-b31a6c0c90cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY5MDR8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1768284146796-8fb25655016e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4NzN8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1769423456200-ee3bd2784ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY5MTR8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1768477007256-9a27fd44fc62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY2MzB8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770367214408-1b6bcacd6332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY2MzB8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770281151839-51fcd6c94439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MDh8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770283553813-238f9500551d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MDh8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770074051176-76dc5019be0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDcxODR8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1767968037382-8eb9c564339f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MzV8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770386085173-b7410ddc993c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY4MzV8&ixlib=rb-4.1.0&q=80&w=600",
    "https://images.unsplash.com/photo-1770387200335-31ae84af6b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzA3NDY5MzV8&ixlib=rb-4.1.0&q=80&w=600",
];

const MIN_COL_WIDTH = 160; // px per column minimum

const getCols = (width: number) => {
    return Math.max(2, Math.floor(width / MIN_COL_WIDTH));
};

export default function GalleryWindow() {
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewSize, setPreviewSize] = useState({ w: 560, h: 480 });
    const [cols, setCols] = useState(4);
    const containerRef = useRef<HTMLDivElement>(null);

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
                {IMAGES.map((src, i) => (
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
