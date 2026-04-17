"use client";

import { useMemo } from "react";
import Masonry, { type MasonryItem } from "@/components/ui/Masonry";
import type { GalleryItem } from "../types";

function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

interface GalleryGridProps {
    items: GalleryItem[];
    onItemClick: (item: GalleryItem) => void;
}

export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
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
