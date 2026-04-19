"use client";

import { useMemo } from "react";
import Masonry, { type MasonryItem } from "@/components/ui/Masonry";
import type { GalleryItem } from "../types";

function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function VideoBadge({ label }: { label: string }) {
    return (
        <span
            className="gallery-video-badge"
            aria-hidden="true"
            style={{
                position: "absolute",
                right: 10,
                top: 10,
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 7px",
                borderRadius: 5,
                background: "rgba(220, 38, 38, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                boxShadow: "0 4px 12px rgba(185, 28, 28, 0.35)",
                color: "#FFFFFF",
                fontFamily: "var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                lineHeight: 1.4,
                pointerEvents: "none",
                userSelect: "none",
            }}
        >
            {label}
        </span>
    );
}

interface GalleryGridProps {
    items: GalleryItem[];
    onItemClick: (item: GalleryItem) => void;
}

export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
    // Convert GalleryItems to MasonryItems — memoized so reference only changes when items change
    const masonryItems: MasonryItem[] = useMemo(() => items.map((item) => {
        const img =
            item.type === "youtube" && item.videoId
                ? getYouTubeThumbnail(item.videoId)
                : item.type === "gdrive" && item.videoId
                    ? `https://drive.google.com/thumbnail?id=${item.videoId}&sz=w800`
                    : item.url;

        const isVideo = item.type === "youtube" || item.type === "gdrive";
        const label = item.type === "youtube" ? "Video" : "Video";

        return {
            id: item.url,
            img,
            url: item.url,
            height: 400,
            ...(isVideo ? { overlay: <VideoBadge label={label} /> } : {}),
        };
    }), [items]);

    return (
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
                if (item) onItemClick(item);
            }}
        />
    );
}
