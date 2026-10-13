import type { AnchorHTMLAttributes, ComponentType, ReactNode, Ref } from "react";

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

export type PaginatorProps = BasePaginatorProps & {
    /** The component to draw navigating entries with. */
    linkComponent?: ComponentType<PaginatorLinkProps>;
    /** Draws one page entry. */
    renderPage: (entry: PaginatorPageEntry, renderProps: InteractionFlags<PaginatorPageRenderProps>) => ReactNode;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: (entry: PaginatorGapEntry, placement: PlacementRect | undefined) => ReactNode;
    /** Draws one of the move controls. */
    renderStep: (step: PaginatorStep, renderProps: InteractionFlags<PaginatorStepRenderProps>) => ReactNode;
};
