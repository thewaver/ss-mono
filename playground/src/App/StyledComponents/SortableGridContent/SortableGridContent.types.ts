import type {
    AccessorProps,
    InteractionFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components";

export type SortableGridPaint = "outline" | "cells";

export type SortableGridItemContentProps = AccessorProps<{
    flags: InteractionFlags<SortableGridItemFlags>;
    geometry: SortableGridGeometry;
    glyph: string;
    name: string;
    paint?: SortableGridPaint;
    hue?: number;
}>;

export type SortableGridCellProps = AccessorProps<{
    spot: SortableGridSpot;
}>;

export type SortableGridLandingProps = AccessorProps<{
    isAllowed: boolean;
    geometry: SortableGridGeometry;
}>;

export type SortableGridSurfaceProps = AccessorProps<{
    flags: InteractionFlags<SortableGridFlags>;
    emptyText: string;
}>;
