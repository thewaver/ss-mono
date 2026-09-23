import type { PaginatorStep } from "./Paginator.types";

export const PAGINATOR_DEFAULTS = {
    steps: ["previous", "next"] as PaginatorStep[],
    siblingCount: 1,
    boundaryCount: 1,
    gap: 0,
    ariaLabel: "Pagination",
};
