import type { ReactNode } from "react";

export type GalleryItem = {
    name: string;
    href: string;
    component: () => ReactNode;
};

export type GallerySection = {
    name: string;
    description?: string;
    items: GalleryItem[];
};

export type GalleryPageProps = {
    sections: GallerySection[];
};

export type GalleryTileProps = {
    item: GalleryItem;
};
