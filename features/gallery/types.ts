export interface GalleryItem {
    url: string;
    type: "image" | "youtube" | "gdrive";
    videoId?: string;
}
