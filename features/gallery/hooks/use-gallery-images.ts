"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { GalleryItem } from "../types";

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

export function useGalleryImages(): GalleryItem[] {
    const [items, setItems] = useState<GalleryItem[]>(() => loadCache());

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

    return items;
}
