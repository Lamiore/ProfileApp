export interface GalleryItem {
    id: string;
    url: string;
    originalUrl?: string;
    name?: string;
    source?: "youtube" | "gdrive" | "image";
    type?: "image" | "video";
    createdAt?: { toDate: () => Date };
}

export type BlogBlockType =
    | "text"
    | "heading"
    | "quote"
    | "list"
    | "code"
    | "image"
    | "divider";

export interface BlogBlock {
    id: number;
    type: BlogBlockType;
    content: string;
    meta?: string;
}

export interface BlogItem {
    id: string;
    title: string;
    thumbnail?: string;
    blocks?: { type: string; content: string; meta?: string }[];
    createdAt?: { toDate: () => Date };
}
