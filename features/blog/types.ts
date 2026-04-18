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
    /** Generic side-channel per type: image caption, quote attribution, code language, list style (bullet|numbered), heading level (h2|h3). */
    meta?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    blocks?: BlogBlock[];
    thumbnail?: string;
    createdAt?: { toDate: () => Date };
}
