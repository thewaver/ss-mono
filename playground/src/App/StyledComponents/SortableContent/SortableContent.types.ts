import type {
    AccessorProps,
    InteractionFlags,
    SortableDir,
    SortableFlags,
    SortableItemFlags,
} from "@thewaver/ss-components";

export type SortableItemContentProps = AccessorProps<{
    flags: InteractionFlags<SortableItemFlags>;
    detail?: string;
}>;

export type SortableSurfaceProps = AccessorProps<{
    flags: InteractionFlags<SortableFlags>;
    emptyText: string;
}>;

export type SortableMarkerProps = AccessorProps<{
    dir: SortableDir;
}>;
