import type {
    InteractionFlags,
    SortableFlags,
    SortableItemFlags,
    SortableOrientation,
} from "@thewaver/ss-components-vue";

export type SortableItemContentProps = {
    flags: InteractionFlags<SortableItemFlags>;
    detail?: string;
    isCenterd?: boolean;
};

export type SortableSurfaceProps = {
    flags: InteractionFlags<SortableFlags>;
    emptyText: string;
};

export type SortableMarkerProps = {
    orientation: SortableOrientation;
};
