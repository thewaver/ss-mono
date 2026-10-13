import type { Accessor, Component, JSX } from "solid-js";

import type {
    BasePaginatorCbs,
    BasePaginatorValues,
    InteractionFlags,
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

export type PaginatorProps = AccessorValues<BasePaginatorValues> &
    BasePaginatorCbs &
    AccessorProps<{
        /** The component to draw navigating entries with. */
        linkComponent?: Component<PaginatorLinkProps>;
        /** Draws one page entry. */
        renderPage: (
            getEntry: Accessor<PaginatorPageEntry>,
            getRenderProps: () => InteractionFlags<PaginatorPageRenderProps>,
        ) => JSX.Element;
        /** Draws the break standing in for the pages that were left out. */
        renderGap: (
            getEntry: Accessor<PaginatorGapEntry>,
            getPlacement: () => PlacementRect | undefined,
        ) => JSX.Element;
        /** Draws one of the move controls. */
        renderStep: (
            getStep: Accessor<PaginatorStep>,
            getRenderProps: () => InteractionFlags<PaginatorStepRenderProps>,
        ) => JSX.Element;
    }>;
