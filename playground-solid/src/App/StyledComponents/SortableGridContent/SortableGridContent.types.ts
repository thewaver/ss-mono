import type {
    AccessorProps,
    InteractionFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components-solid";

export type SortableGridPaint = "contour" | "cells";

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
    isBlocked?: boolean;
}>;

export type SortableGridLandingProps = AccessorProps<{
    isAllowed: boolean;
    geometry: SortableGridGeometry;
}>;

export type SortableGridSurfaceProps = AccessorProps<{
    flags: InteractionFlags<SortableGridFlags>;
    emptyText: string;
}>;
