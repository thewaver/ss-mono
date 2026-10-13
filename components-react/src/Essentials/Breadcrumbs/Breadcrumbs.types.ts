import type { ComponentType, ReactNode } from "react";

import type { BaseBreadcrumbsProps, Breadcrumb, BreadcrumbsFlags, InteractionFlags } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TabLinkProps } from "../Tabs/Tabs.types";

export type BreadcrumbsItemProps<T> = Omit<InteractionControlProps<BreadcrumbsFlags>, "id"> & {
    /** The crumb this item stands for. */
    crumb: Breadcrumb<T>;
    /** The component to draw a navigating crumb with. */
    linkComponent?: ComponentType<TabLinkProps>;
    /** Runs when this crumb is chosen. */
    onSelect: (value: T) => void;
};

export type BreadcrumbsProps<T> = BaseBreadcrumbsProps<T> & {
    /** The component to draw navigating crumbs with, for a trail of links rather than of buttons. */
    linkComponent?: ComponentType<TabLinkProps>;
    /** Draws whatever sits between two crumbs. */
    renderSeparator?: () => ReactNode;
    /** Draws one crumb. */
    renderCrumb: (crumb: Breadcrumb<T>, flags: InteractionFlags<BreadcrumbsFlags>) => ReactNode;
};
