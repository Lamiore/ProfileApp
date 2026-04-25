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
    category?: string;
    thumbnail?: string;
    blocks?: { type: string; content: string; meta?: string }[];
    createdAt?: { toDate: () => Date };
}

export interface WorkItem {
    id: string;
    tag: string;
    title: string;
    desc: string;
    media: string;
    isVideo?: boolean;
    createdAt?: { toDate: () => Date };
}

export interface ProjectItem {
    id: string;
    tag: string;
    title: string;
    desc: string;
    media: string;
    isVideo?: boolean;
    link?: string;
    createdAt?: { toDate: () => Date };
}

export type ShopStatus = "available" | "sold-out" | "coming-soon";

export interface ShopItem {
    id: string;
    title: string;
    image: string;
    price: string;
    desc: string;
    category: string;
    status: ShopStatus;
    createdAt?: { toDate: () => Date };
}
