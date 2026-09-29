import type { Component, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

import type {
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageEntry,
    PaginatorPageRenderProps,
    PaginatorStep,
    PaginatorStepRenderProps,
    PlacementLayoutFn,
    PlacementRect,
    ProximityEffectFn,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type PaginatorLinkProps = HTMLAnchorAttributes & {
    /**
     * Where the link goes. Spread every prop onto the anchor: they carry the paginator's hold on the element, which is
     * what it listens on.
     */
    href: string;
};

export type PaginatorItemProps<TExtra extends object> = InteractionControlProps<TExtra> & {
    /** Where this entry navigates to, for a paginator of links rather than of buttons. */
    href: string | undefined;
    /** Whether this is the page currently being shown. */
    isCurrent: boolean;
    /** The component to draw a navigating entry with. */
    linkComponent?: Component<PaginatorLinkProps>;
    /** Runs when this entry is activated. */
    onActivate: () => void;
};

export type PaginatorProps = {
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
    /** The component to draw navigating entries with. */
    linkComponent?: Component<PaginatorLinkProps>;
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
    /** Which page is being shown. It is the only thing that moves the paginator. */
    page: number;
    /** Draws one page entry. */
    renderPage: Snippet<[entry: PaginatorPageEntry, renderProps: InteractionFlags<PaginatorPageRenderProps>]>;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: Snippet<[entry: PaginatorGapEntry, placement: PlacementRect | undefined]>;
    /** Draws one of the move controls. */
    renderStep: Snippet<[step: PaginatorStep, renderProps: InteractionFlags<PaginatorStepRenderProps>]>;
    /** Runs when a different page is asked for. */
    onPageChange?: (page: number) => void;
};
