import type { Snippet } from "svelte";

import type {
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageRenderProps,
    PaginatorStepRenderProps,
    PlacementRect,
} from "@thewaver/ss-components-svelte";

export type PaginatorPageContentProps = {
    renderProps: InteractionFlags<PaginatorPageRenderProps>;
};

export type PaginatorStepContentProps = {
    renderProps: InteractionFlags<PaginatorStepRenderProps>;
};

export type PaginatorGapContentProps = {
    entry: PaginatorGapEntry;
};

export type PaginatorDialGapContentProps = {
    entry: PaginatorGapEntry;
    placement: PlacementRect | undefined;
};

export type PaginatorWedgeProps = {
    placement: PlacementRect;
    isCurrent?: boolean;
    isHovered?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    children?: Snippet;
};

export type PaginatorPanelProps = {
    page: number;
    pageCount: number;
};
