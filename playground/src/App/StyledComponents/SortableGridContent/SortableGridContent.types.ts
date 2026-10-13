import type {
    InteractionFlags,
    SortableGridFlags,
    SortableGridGeometry,
    SortableGridItemFlags,
    SortableGridSpot,
} from "@thewaver/ss-components";

export type SortableGridPaint = "contour" | "cells";

export type BaseSortableGridItemContentValues = {
    flags: InteractionFlags<SortableGridItemFlags>;
    geometry: SortableGridGeometry;
    glyph: string;
    name: string;
    paint?: SortableGridPaint;
    hue?: number;
};

export type BaseSortableGridItemContentProps = BaseSortableGridItemContentValues;

export type BaseSortableGridCellValues = {
    spot: SortableGridSpot;
    isBlocked?: boolean;
};

export type BaseSortableGridCellProps = BaseSortableGridCellValues;

export type BaseSortableGridLandingValues = {
    isAllowed: boolean;
    geometry: SortableGridGeometry;
};

export type BaseSortableGridLandingProps = BaseSortableGridLandingValues;

export type BaseSortableGridSurfaceValues = {
    flags: InteractionFlags<SortableGridFlags>;
    emptyText: string;
};

export type BaseSortableGridSurfaceProps = BaseSortableGridSurfaceValues;
