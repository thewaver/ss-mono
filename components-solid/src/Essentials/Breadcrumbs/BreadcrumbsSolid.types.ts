import type { Accessor, Component, JSX } from "solid-js";

import type {
    BaseBreadcrumbsCbs,
    BaseBreadcrumbsValues,
    Breadcrumb,
    BreadcrumbsFlags,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor } from "../../Utils/typeUtils";
import type { TabLinkProps } from "../Tabs/TabsSolid.types";

export type BreadcrumbsItemProps<T> = AccessorProps<
    Omit<InteractionControlProps<BreadcrumbsFlags>, "id"> & {
        /** The component to draw a navigating crumb with. */
        linkComponent?: Component<TabLinkProps>;
    }
> & {
    /** The crumb this item stands for. */
    crumb: MaybeAccessor<Breadcrumb<T>>;
    /** Runs when this crumb is chosen. */
    onSelect: (value: T) => void;
};

export type BreadcrumbsProps<T> = AccessorValues<BaseBreadcrumbsValues<T>> &
    BaseBreadcrumbsCbs<T> &
    AccessorProps<{
        /** The component to draw navigating crumbs with, for a trail of links rather than of buttons. */
        linkComponent?: Component<TabLinkProps>;
        /** Draws whatever sits between two crumbs. */
        renderSeparator?: () => JSX.Element;
    }> & {
        /** Draws one crumb. */
        renderCrumb: (
            getCrumb: Accessor<Breadcrumb<T>>,
            getFlags: () => InteractionFlags<BreadcrumbsFlags>,
        ) => JSX.Element;
    };
