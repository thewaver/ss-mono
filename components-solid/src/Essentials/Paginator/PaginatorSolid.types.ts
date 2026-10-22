import type { Accessor, Component, JSX } from "solid-js";

import type {
    BasePaginatorCbs,
    BasePaginatorPagesCbs,
    BasePaginatorPagesValues,
    BasePaginatorRootCbs,
    BasePaginatorRootValues,
    BasePaginatorStepsCbs,
    BasePaginatorStepsValues,
    BasePaginatorValues,
    InteractionFlags,
    PaginatorContextType,
    PaginatorGapEntry,
    PaginatorPageEntry,
    PaginatorPageRenderProps,
    PaginatorStep,
    PaginatorStepRenderProps,
    PlacementRect,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues } from "../../Utils/typeUtils";

export type PaginatorLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type PaginatorSolidContextType = PaginatorContextType & {
    getLinkComponent: () => Component<PaginatorLinkProps> | undefined;
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

type PaginatorRootOwnProps = AccessorProps<{
    /** The component to draw navigating entries with, in every piece inside. */
    linkComponent?: Component<PaginatorLinkProps>;
}>;

type PaginatorStepsOwnProps = AccessorProps<{
    /** Draws one of the move controls. */
    renderStep: (
        getStep: Accessor<PaginatorStep>,
        getRenderProps: () => InteractionFlags<PaginatorStepRenderProps>,
    ) => JSX.Element;
}>;

type PaginatorPagesOwnProps = AccessorProps<{
    /** Draws one page entry. */
    renderPage: (
        getEntry: Accessor<PaginatorPageEntry>,
        getRenderProps: () => InteractionFlags<PaginatorPageRenderProps>,
    ) => JSX.Element;
    /** Draws the break standing in for the pages that were left out. */
    renderGap: (getEntry: Accessor<PaginatorGapEntry>, getPlacement: () => PlacementRect | undefined) => JSX.Element;
}>;

export type PaginatorRootProps = AccessorValues<BasePaginatorRootValues> & BasePaginatorRootCbs & PaginatorRootOwnProps;

export type PaginatorStepsProps = AccessorValues<BasePaginatorStepsValues> &
    BasePaginatorStepsCbs &
    PaginatorStepsOwnProps;

export type PaginatorPagesProps = AccessorValues<BasePaginatorPagesValues> &
    BasePaginatorPagesCbs &
    PaginatorPagesOwnProps;

export type PaginatorProps = AccessorValues<BasePaginatorValues> &
    BasePaginatorCbs &
    PaginatorRootOwnProps &
    PaginatorStepsOwnProps &
    PaginatorPagesOwnProps;
