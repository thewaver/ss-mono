import type { Component, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

import type {
    BasePaginatorProps,
    InteractionFlags,
    PaginatorGapEntry,
    PaginatorPageEntry,
    PaginatorPageRenderProps,
    PaginatorStep,
    PaginatorStepRenderProps,
    PlacementRect,
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

export type PaginatorProps = BasePaginatorProps & {
    /** The component to draw navigating entries with. */
    linkComponent?: Component<PaginatorLinkProps>;
    /** Draws one page entry. */
    renderPage: Snippet<[entry: PaginatorPageEntry, renderProps: InteractionFlags<PaginatorPageRenderProps>]>;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: Snippet<[entry: PaginatorGapEntry, placement: PlacementRect | undefined]>;
    /** Draws one of the move controls. */
    renderStep: Snippet<[step: PaginatorStep, renderProps: InteractionFlags<PaginatorStepRenderProps>]>;
};
