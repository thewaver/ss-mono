import type { AnchorHTMLAttributes, ComponentType, PropsWithChildren, ReactNode, Ref } from "react";

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

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type PaginatorLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Where the link goes. */
    href: string;
    /** Receives the link element, which is what the paginator listens on. */
    ref?: Ref<HTMLAnchorElement>;
};

export type PaginatorItemProps<TExtra extends object> = InteractionControlProps<TExtra> & {
    /** Where this entry navigates to, for a paginator of links rather than of buttons. */
    href: string | undefined;
    /** Whether this is the page currently being shown. */
    isCurrent: boolean;
    /** The component to draw a navigating entry with. */
    linkComponent?: ComponentType<PaginatorLinkProps>;
    /** Runs when this entry is activated. */
    onActivate: () => void;
};

type PaginatorRootOwnProps = {
    /** The component to draw navigating entries with, in every piece inside. */
    linkComponent?: ComponentType<PaginatorLinkProps>;
};

type PaginatorStepsOwnProps = {
    /** Draws one of the move controls. */
    renderStep: (step: PaginatorStep, renderProps: InteractionFlags<PaginatorStepRenderProps>) => ReactNode;
};

type PaginatorPagesOwnProps = {
    /** Draws one page entry. */
    renderPage: (entry: PaginatorPageEntry, renderProps: InteractionFlags<PaginatorPageRenderProps>) => ReactNode;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: (entry: PaginatorGapEntry, placement: PlacementRect | undefined) => ReactNode;
};

export type PaginatorRootProps = PropsWithChildren<BasePaginatorRootProps & PaginatorRootOwnProps>;

export type PaginatorStepsProps = PropsWithChildren<BasePaginatorStepsProps & PaginatorStepsOwnProps>;

export type PaginatorPagesProps = BasePaginatorPagesProps & PaginatorPagesOwnProps;

export type PaginatorProps = BasePaginatorProps &
    PaginatorRootOwnProps &
    PaginatorStepsOwnProps &
    PaginatorPagesOwnProps;
