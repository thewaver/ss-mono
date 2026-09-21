import type { Accessor, Component, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";
import type { TabLinkProps } from "../Tabs/Tabs.types";

export type BreadcrumbsFlags = {
    isCurrent: boolean;
};

export type Breadcrumb<T> = {
    value: T;
    href?: string;
    isDisabled?: boolean;
    id?: string;
};

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

export type BreadcrumbsProps<T> = AccessorProps<{
    /** The space between crumbs and separators. */
    gap?: number;
    /**
     * Names the trail for assistive technology. Required, because the `<nav>` around it is a landmark and
     * nothing else can name it — a page with two unnamed navigation landmarks gives a reader no way to tell
     * them apart.
     */
    ariaLabel: string;
    /** The component to draw navigating crumbs with, for a trail of links rather than of buttons. */
    linkComponent?: Component<TabLinkProps>;
    /** Draws whatever sits between two crumbs. */
    renderSeparator?: () => JSX.Element;
}> & {
    /** The crumbs, from the root to where the reader is now. Whatever does not fit collapses into a menu. */
    crumbs: MaybeAccessor<Breadcrumb<T>[]>;
    /** Draws one crumb. */
    renderCrumb: (getCrumb: Accessor<Breadcrumb<T>>, getFlags: () => InteractionFlags<BreadcrumbsFlags>) => JSX.Element;
    /** Runs when a crumb is chosen. */
    onSelect?: (value: T) => void;
};
