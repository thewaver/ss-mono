import type { AnchorHTMLAttributes, Component, VNodeChild } from "vue";

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

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type PaginatorLinkProps = AnchorHTMLAttributes & {
    /** Where the link goes. */
    href: string;
};

export type PaginatorItemProps<TExtra extends object> = InteractionControlProps<TExtra> & {
    /** Where this entry navigates to, for a paginator of links rather than of buttons. */
    href: string | undefined;
    /** Whether this is the page currently being shown. */
    isCurrent: boolean;
    /** The component to draw a navigating entry with. Its `$el` is what the paginator listens on. */
    linkComponent?: Component<PaginatorLinkProps>;
    /** Runs when this entry is activated. */
    onActivate: () => void;
};

export type PaginatorProps = BasePaginatorProps & {
    /** The component to draw navigating entries with. Its `$el` is what the paginator listens on. */
    linkComponent?: Component<PaginatorLinkProps>;
};

export type PaginatorSlots = {
    /** Draws one page entry. */
    renderPage: (props: {
        entry: PaginatorPageEntry;
        renderProps: InteractionFlags<PaginatorPageRenderProps>;
    }) => VNodeChild;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: (props: { entry: PaginatorGapEntry; placement: PlacementRect | undefined }) => VNodeChild;
    /** Draws one of the move controls. */
    renderStep: (props: { step: PaginatorStep; renderProps: InteractionFlags<PaginatorStepRenderProps> }) => VNodeChild;
};
