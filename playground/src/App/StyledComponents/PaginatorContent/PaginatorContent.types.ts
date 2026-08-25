import type {
    AccessorProps,
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageFlags,
    PaginatorStepFlags,
} from "@thewaver/ss-components";

export type PaginatorPageContentProps = AccessorProps<{
    flags: InteractionFlags<PaginatorPageFlags>;
}>;

export type PaginatorStepContentProps = AccessorProps<{
    flags: InteractionFlags<PaginatorStepFlags>;
}>;

export type PaginatorGapContentProps = AccessorProps<{
    entry: PaginatorGapEntry;
}>;
