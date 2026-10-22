import type { Component, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

import type {
    BasePaginatorPagesProps,
    BasePaginatorProps,
    BasePaginatorRootProps,
    BasePaginatorStepsProps,
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageEntry,
    PaginatorPageRenderProps,
    PaginatorStep,
    PaginatorStepRenderProps,
    PlacementRect,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
import type { PaginatorSvelteContextType } from "./Paginator.context.types.js";

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

type PaginatorRootOwnProps = {
    /** The component to draw navigating entries with, in every piece inside. */
    linkComponent?: Component<PaginatorLinkProps>;
};

type PaginatorStepsOwnProps = {
    /** Draws one of the move controls. */
    renderStep: Snippet<[step: PaginatorStep, renderProps: InteractionFlags<PaginatorStepRenderProps>]>;
};

type PaginatorPagesOwnProps = {
    /** Draws one page entry. */
    renderPage: Snippet<[entry: PaginatorPageEntry, renderProps: InteractionFlags<PaginatorPageRenderProps>]>;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: Snippet<[entry: PaginatorGapEntry, placement: PlacementRect | undefined]>;
};

export type PaginatorRootProps = BasePaginatorRootProps &
    PaginatorRootOwnProps & {
        /** The pieces, arranged however the page wants them, with anything of the page's own between them. */
        children?: Snippet;
    };

export type PaginatorStepsProps = BasePaginatorStepsProps &
    PaginatorStepsOwnProps & {
        /** What sits between previous and next: a `PaginatorPages`, a "3 of 20" label, or anything else. */
        children?: Snippet;
    };

export type PaginatorPagesProps = BasePaginatorPagesProps & PaginatorPagesOwnProps;

export type PaginatorProps = BasePaginatorProps &
    PaginatorRootOwnProps &
    PaginatorStepsOwnProps &
    PaginatorPagesOwnProps;

export type PaginatorStepControlProps = Pick<PaginatorStepsProps, "computeStepLabel" | "renderStep"> & {
    /** The root this control registers with and reads the page from. */
    context: PaginatorSvelteContextType;
    /** Which move control this is. */
    step: PaginatorStep;
};

export type PaginatorEntryControlProps<T> = Pick<
    PaginatorPagesProps,
    "computePageLabel" | "renderPage" | "renderGap"
> & {
    /** The root this control registers with and reads the page from. */
    context: PaginatorSvelteContextType;
    /** The page or the gap this control stands for. */
    entry: T;
};
