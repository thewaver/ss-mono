import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

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

export type BasePaginatorValues = {
    /** How many pages there are. */
    pageCount: number;
    /** How many pages are shown on each side of the current one before the run is broken. */
    siblingCount?: number;
    /** How many pages are always shown at each end, however far away the current page is. */
    boundaryCount?: number;
    /** Which move controls are shown, and in what order. */
    steps?: PaginatorStep[];
    /** The space between entries. */
    gap?: number;
    /** Turns the paginator off, so none of its pages or controls respond. */
    isDisabled?: boolean;
    /** Names the paginator for assistive technology. */
    ariaLabel: string;
    /** Which page is being shown. It is the only thing that moves the paginator. */
    page: number;
};

export type BasePaginatorCbs = {
    /** Where one page navigates to, for a paginator of links rather than of buttons. */
    computeHref?: (page: number) => string;
    /** Names one page for assistive technology, and is told how many there are so it can say page three of ten. */
    computePageLabel: (page: number, pageCount: number) => string;
    /** Names one of the move controls, and is told which page it would go to. */
    computeStepLabel: (step: PaginatorStep, targetPage: number) => string;
    /** Arranges the entries, for a paginator that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the entries do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Runs when a different page is asked for. */
    onPageChange?: (page: number) => void;
};

export type BasePaginatorProps = BasePaginatorValues & BasePaginatorCbs;
