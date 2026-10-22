import type { AnchorHTMLAttributes, Component, VNodeChild } from "vue";

import type {
    BasePaginatorPagesProps,
    BasePaginatorProps,
    BasePaginatorRootProps,
    BasePaginatorStepsProps,
    InteractionFlags,
    PaginatorContextType,
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

export type PaginatorVueContextType = PaginatorContextType & {
    getLinkComponent: () => Component<PaginatorLinkProps> | undefined;
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

type PaginatorRootOwnProps = {
    /**
     * The component to draw navigating entries with, in every piece inside. Its `$el` is what the paginator listens
     * on.
     */
    linkComponent?: Component<PaginatorLinkProps>;
};

export type PaginatorRootProps = BasePaginatorRootProps & PaginatorRootOwnProps;

export type PaginatorRootSlots = {
    /** The pieces, arranged however the page wants them. */
    default?: () => VNodeChild;
};

export type PaginatorStepsProps = BasePaginatorStepsProps;

export type PaginatorStepsSlots = {
    /** Draws one of the move controls. */
    renderStep: (props: { step: PaginatorStep; renderProps: InteractionFlags<PaginatorStepRenderProps> }) => VNodeChild;
    /** What sits between first and previous on one side and next and last on the other. */
    default?: () => VNodeChild;
};

export type PaginatorPagesProps = BasePaginatorPagesProps;

export type PaginatorPagesSlots = {
    /** Draws one page entry. */
    renderPage: (props: {
        entry: PaginatorPageEntry;
        renderProps: InteractionFlags<PaginatorPageRenderProps>;
    }) => VNodeChild;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: (props: { entry: PaginatorGapEntry; placement: PlacementRect | undefined }) => VNodeChild;
};

export type PaginatorProps = BasePaginatorProps & PaginatorRootOwnProps;

export type PaginatorSlots = Pick<PaginatorStepsSlots, "renderStep"> & PaginatorPagesSlots;
