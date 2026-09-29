export type PaginatorExampleProps = {
    page: number;
    pageCount: number;
    siblingCount: number;
    boundaryCount: number;
    isDisabled: boolean;
    onPageChange: (page: number) => void;
};
