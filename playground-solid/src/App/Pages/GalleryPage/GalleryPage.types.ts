import type { JSX } from "solid-js";

export type GalleryItem = {
    name: string;
    href: string;
    component: () => JSX.Element;
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
