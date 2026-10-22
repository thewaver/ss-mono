import type { PaginatorStep } from "./Paginator.types";

export const PAGINATOR_DEFAULTS = {
    steps: ["previous", "next"] as PaginatorStep[],
    siblingCount: 1,
    boundaryCount: 1,
    pageSize: 10,
    gap: 0,
};
