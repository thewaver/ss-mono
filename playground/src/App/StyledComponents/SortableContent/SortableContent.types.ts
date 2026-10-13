import type { InteractionFlags, SortableFlags, SortableItemFlags, SortableOrientation } from "@thewaver/ss-components";

export type BaseSortableItemContentValues = {
    flags: InteractionFlags<SortableItemFlags>;
    detail?: string;
    isCenterd?: boolean;
};

export type BaseSortableItemContentProps = BaseSortableItemContentValues;

export type BaseSortableSurfaceValues = {
    flags: InteractionFlags<SortableFlags>;
    emptyText: string;
};

export type BaseSortableSurfaceProps = BaseSortableSurfaceValues;

export type BaseSortableMarkerValues = {
    orientation: SortableOrientation;
};

export type BaseSortableMarkerProps = BaseSortableMarkerValues;
