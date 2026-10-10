import type { Component } from "vue";

export type GalleryItem = {
    name: string;
    href: string;
    component: Component;
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
