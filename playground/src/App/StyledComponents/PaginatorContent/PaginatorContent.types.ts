import type {
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageRenderProps,
    PaginatorStepRenderProps,
    PlacementRect,
} from "@thewaver/ss-components";

export type BasePaginatorPageContentValues = {
    renderProps: InteractionFlags<PaginatorPageRenderProps>;
};

export type BasePaginatorPageContentProps = BasePaginatorPageContentValues;

export type BasePaginatorStepContentValues = {
    renderProps: InteractionFlags<PaginatorStepRenderProps>;
};

export type BasePaginatorStepContentProps = BasePaginatorStepContentValues;

export type BasePaginatorGapContentValues = {
    entry: PaginatorGapEntry;
};

export type BasePaginatorGapContentProps = BasePaginatorGapContentValues;

export type BasePaginatorDialGapContentValues = {
    entry: PaginatorGapEntry;
    placement: PlacementRect | undefined;
};

export type BasePaginatorDialGapContentProps = BasePaginatorDialGapContentValues;

export type BasePaginatorPanelValues = {
    page: number;
    itemCount: number;
    pageSize: number;
};

export type BasePaginatorPanelProps = BasePaginatorPanelValues;

export type BasePaginatorCountContentValues = {
    page: number;
    pageCount: number;
};

export type BasePaginatorCountContentProps = BasePaginatorCountContentValues;
