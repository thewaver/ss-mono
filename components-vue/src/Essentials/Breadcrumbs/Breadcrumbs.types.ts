import type { Component, VNodeChild } from "vue";

import type { Breadcrumb, BreadcrumbsFlags, InteractionFlags } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TabLinkProps } from "../Tabs/Tabs.types";

export type BreadcrumbsItemProps<T> = Omit<InteractionControlProps<BreadcrumbsFlags>, "id"> & {
    /** The crumb this item stands for. */
    crumb: Breadcrumb<T>;
    /** The component to draw a navigating crumb with. */
    linkComponent?: Component<TabLinkProps>;
    /** Runs when this crumb is chosen. */
    onSelect: (value: T) => void;
};

export type BreadcrumbsProps<T> = {
    /** The space between crumbs and separators. */
    gap?: number;
    /**
     * Names the trail for assistive technology. Required, because the `<nav>` around it is a landmark and nothing
     * else can name it — a page with two unnamed navigation landmarks gives a reader no way to tell them apart.
     */
    ariaLabel: string;
    /** The component to draw navigating crumbs with, for a trail of links rather than of buttons. */
    linkComponent?: Component<TabLinkProps>;
    /** The crumbs, from the root to where the reader is now. */
    crumbs: Breadcrumb<T>[];
    /** Runs when a crumb is chosen. */
    onSelect?: (value: T) => void;
};

export type BreadcrumbsSlots<T> = {
    /** Draws whatever sits between two crumbs. */
    renderSeparator?: () => VNodeChild;
    /** Draws one crumb. */
    renderCrumb: (props: { crumb: Breadcrumb<T>; flags: InteractionFlags<BreadcrumbsFlags> }) => VNodeChild;
};
