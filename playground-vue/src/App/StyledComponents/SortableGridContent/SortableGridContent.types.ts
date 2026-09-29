import type {
    InteractionFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components-vue";

export type SortableGridPaint = "outline" | "cells";

export type SortableGridItemContentProps = {
    flags: InteractionFlags<SortableGridItemFlags>;
    geometry: SortableGridGeometry;
    glyph: string;
    name: string;
    paint?: SortableGridPaint;
    hue?: number;
};

export type SortableGridCellProps = {
    spot: SortableGridSpot;
    isBlocked?: boolean;
};

export type SortableGridLandingProps = {
    isAllowed: boolean;
    geometry: SortableGridGeometry;
};

export type SortableGridSurfaceProps = {
    flags: InteractionFlags<SortableGridFlags>;
    emptyText: string;
};
