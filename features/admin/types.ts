export interface GalleryItem {
    id: string;
    url: string;
    name?: string;
    createdAt?: { toDate: () => Date };
}

export interface BlogBlock {
    id: number;
    type: "text" | "image";
    content: string;
}

export interface BlogItem {
    id: string;
    title: string;
    thumbnail?: string;
    blocks?: { type: string; content: string }[];
    createdAt?: { toDate: () => Date };
}
