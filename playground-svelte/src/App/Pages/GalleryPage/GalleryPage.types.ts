import type { LazyRouteComponent } from "sv-router";

export type GalleryItem = {
    name: string;
    href: string;
    component: LazyRouteComponent;
};

export type GallerySection = {
    name: string;
    description?: string;
    items: GalleryItem[];
};

export type GalleryTileProps = {
    item: GalleryItem;
};
