export interface WorkItem {
    id: string;
    tag?: string;
    title: string;
    desc?: string;
    media: string;
    isVideo?: boolean;
    createdAt?: { toDate: () => Date };
}
