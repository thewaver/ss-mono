export type BasePaginatorExampleValues = {
    page: number;
    itemCount: number;
    pageSize: number;
    siblingCount: number;
    boundaryCount: number;
    isDisabled: boolean;
};

export type BasePaginatorExampleCbs = {
    onPageChange: (page: number) => void;
};

export type BasePaginatorExampleProps = BasePaginatorExampleValues & BasePaginatorExampleCbs;
