import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";

export type PaginatorControlEntry = {
    getElementRef: () => HTMLElement | undefined;
};

export type PaginatorContextType = {
    getPage: () => number;
    getPageCount: () => number;
    getIsDisabled: () => boolean;
    computeHref: (page: number) => string | undefined;
    computePlacement: (entry: PaginatorControlEntry) => PlacementRect | undefined;
    computeStackAt: (entry: PaginatorControlEntry) => number | undefined;
    goTo: (page: number) => void;
    register: (entry: PaginatorControlEntry) => void;
    reorder: () => void;
};
