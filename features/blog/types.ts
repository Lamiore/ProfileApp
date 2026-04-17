export interface BlogBlock {
    id: number;
    type: "text" | "image";
    content: string;
}

export interface BlogPost {
    id: string;
    title: string;
    blocks?: BlogBlock[];
    thumbnail?: string;
    createdAt?: { toDate: () => Date };
}
