import type { AccessorProps } from "@thewaver/ss-components";

export type PaginatorExampleProps = AccessorProps<{
    page: number;
    pageCount: number;
    siblingCount: number;
    boundaryCount: number;
    isDisabled: boolean;
}> & {
    onPageChange: (page: number) => void;
};
