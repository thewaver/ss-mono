import type { ParentProps } from "solid-js";

import type {
    AccessorProps,
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageRenderProps,
    PaginatorStepRenderProps,
    PlacementRect,
} from "@thewaver/ss-components";

export type PaginatorPageContentProps = AccessorProps<{
    renderProps: InteractionFlags<PaginatorPageRenderProps>;
}>;

export type PaginatorStepContentProps = AccessorProps<{
    renderProps: InteractionFlags<PaginatorStepRenderProps>;
}>;

export type PaginatorGapContentProps = AccessorProps<{
    entry: PaginatorGapEntry;
}>;

export type PaginatorDialGapContentProps = AccessorProps<{
    entry: PaginatorGapEntry;
    placement: PlacementRect | undefined;
}>;

export type PaginatorWedgeProps = ParentProps<
    AccessorProps<{
        placement: PlacementRect;
        isCurrent?: boolean;
        isHovered?: boolean;
        isActive?: boolean;
        isDisabled?: boolean;
    }>
>;

export type PaginatorPanelProps = AccessorProps<{
    page: number;
    pageCount: number;
}>;
