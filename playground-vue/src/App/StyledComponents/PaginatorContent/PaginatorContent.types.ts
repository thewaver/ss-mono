import type {
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageRenderProps,
    PaginatorStepRenderProps,
    PlacementRect,
} from "@thewaver/ss-components-vue";

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
};

export type PaginatorPanelProps = {
    page: number;
    pageCount: number;
};
