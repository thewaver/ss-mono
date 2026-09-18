import type { Accessor, Component, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type PaginatorStep = "first" | "previous" | "next" | "last";

export type PaginatorLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

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

export type PaginatorItemProps = AccessorProps<
    InteractionControlProps & {
        /** Where this entry navigates to, for a paginator of links rather than of buttons. */
        href: string | undefined;
        /** Whether this is the page currently being shown. */
        isCurrent: boolean;
        /** The component to draw a navigating entry with. */
        linkComponent?: Component<PaginatorLinkProps>;
        /** Runs when this entry is activated. */
        onActivate: () => void;
    }
>;

export type PaginatorProps = AccessorProps<{
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
    ariaLabel?: string;
    /** The component to draw navigating entries with. */
    linkComponent?: Component<PaginatorLinkProps>;
    /** Where one page navigates to, for a paginator of links rather than of buttons. */
    computeHref?: (page: number) => string;
    /** Names one page for assistive technology, and is told how many there are so it can say page three of ten. */
    computePageLabel?: (page: number, pageCount: number) => string;
    /** Names one of the move controls. */
    computeStepLabel?: (step: PaginatorStep, targetPage: number) => string;
    /** Arranges the entries, for a paginator that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the entries do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Which page is being shown. It is the only thing that moves the paginator. */
    page: number;
    /** Draws one page entry. */
    renderPage: (
        getEntry: Accessor<PaginatorPageEntry>,
        getRenderProps: () => InteractionFlags<PaginatorPageRenderProps>,
    ) => JSX.Element;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: (getEntry: Accessor<PaginatorGapEntry>, getPlacement: () => PlacementRect | undefined) => JSX.Element;
    /** Draws one of the move controls. */
    renderStep: (
        getStep: Accessor<PaginatorStep>,
        getRenderProps: () => InteractionFlags<PaginatorStepRenderProps>,
    ) => JSX.Element;
    /** Runs when a different page is asked for. */
    onPageChange?: (page: number) => void;
}>;
