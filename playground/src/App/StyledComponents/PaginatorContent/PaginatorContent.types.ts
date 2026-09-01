import type {
    AccessorProps,
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageRenderProps,
    PaginatorStepRenderProps,
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
