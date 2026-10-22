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

export type BasePaginatorRootValues = {
    /** How many items there are to page through. The page count is worked out from this and `pageSize`. */
    itemCount: number;
    /** How many items one page holds. The last page holds whatever is left over. */
    pageSize?: number;
    /** Which page is being shown. It is the only thing that moves the paginator. */
    page: number;
    /** Turns the paginator off, so none of its pages or controls respond. */
    isDisabled?: boolean;
    /** Names the paginator for assistive technology. */
    ariaLabel: string;
};

export type BasePaginatorRootCbs = {
    /** Where one page navigates to, for a paginator of links rather than of buttons. Every piece inside reads it. */
    computeHref?: (page: number) => string;
    /** Arranges every step, page and gap inside, in document order, for a paginator that is not a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the entries do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Runs when a different page is asked for. */
    onPageChange?: (page: number) => void;
};

export type BasePaginatorRootProps = BasePaginatorRootValues & BasePaginatorRootCbs;

export type BasePaginatorStepsValues = {
    /** Which move controls are shown. First and previous sit before the slot and next and last after it. */
    steps?: PaginatorStep[];
    /** The space between the controls and whatever sits in the slot. */
    gap?: number;
};

export type BasePaginatorStepsCbs = {
    /** Names one of the move controls, and is told which page it would go to. */
    computeStepLabel: (step: PaginatorStep, targetPage: number) => string;
};

export type BasePaginatorStepsProps = BasePaginatorStepsValues & BasePaginatorStepsCbs;

export type BasePaginatorPagesValues = {
    /** How many pages are shown on each side of the current one before the run is broken. */
    siblingCount?: number;
    /** How many pages are always shown at each end, however far away the current page is. */
    boundaryCount?: number;
    /** The space between entries. */
    gap?: number;
};

export type BasePaginatorPagesCbs = {
    /** Names one page for assistive technology, and is told how many there are so it can say page three of ten. */
    computePageLabel: (page: number, pageCount: number) => string;
};

export type BasePaginatorPagesProps = BasePaginatorPagesValues & BasePaginatorPagesCbs;

export type BasePaginatorValues = BasePaginatorRootValues & BasePaginatorStepsValues & BasePaginatorPagesValues;

export type BasePaginatorCbs = BasePaginatorRootCbs & BasePaginatorStepsCbs & BasePaginatorPagesCbs;

export type BasePaginatorProps = BasePaginatorValues & BasePaginatorCbs;
