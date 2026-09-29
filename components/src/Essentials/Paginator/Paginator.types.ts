import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";

export type PaginatorStep = "first" | "previous" | "next" | "last";

export type PaginatorPageEntry = {
    kind: "page";
    page: number;
};

export type PaginatorGapEntry = {
    kind: "gap";
    from: number;
    to: number;
};

export type PaginatorEntry = PaginatorGapEntry | PaginatorPageEntry;

export type PaginatorRange = {
    pageCount: number;
    siblingCount: number;
    boundaryCount: number;
};

export type PaginatorPageRenderProps = {
    /** Which page this entry stands for. */
    page: number;
    /** Whether this is the page currently being shown. */
    isCurrent: boolean;
    /** Where this entry was placed, for a layout that put it somewhere other than in a row. */
    placement?: PlacementRect;
};

export type PaginatorStepRenderProps = {
    /** Which way this control moves the paginator. */
    step: PaginatorStep;
    /** Which page this control would move to. */
    targetPage: number;
    /** Where this control was placed. */
    placement?: PlacementRect;
};
