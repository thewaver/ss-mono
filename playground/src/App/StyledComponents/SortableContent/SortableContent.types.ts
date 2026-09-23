import type {
    AccessorProps,
    InteractionFlags,
    SortableFlags,
    SortableItemFlags,
    SortableOrientation,
} from "@thewaver/ss-components";

export type SortableItemContentProps = AccessorProps<{
    flags: InteractionFlags<SortableItemFlags>;
    detail?: string;
    isCenterd?: boolean;
}>;

export type SortableSurfaceProps = AccessorProps<{
    flags: InteractionFlags<SortableFlags>;
    emptyText: string;
}>;

export type SortableMarkerProps = AccessorProps<{
    orientation: SortableOrientation;
}>;
