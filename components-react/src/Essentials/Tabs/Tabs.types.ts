import type { AnchorHTMLAttributes, ComponentType, PropsWithChildren, ReactNode, Ref } from "react";

import type { BaseTabPanelProps, BaseTabsProps, InteractionFlags, PlacementRect, Tab } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type TabLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Where the link goes. */
    href: string;
    /** Receives the link element, which is what the tab list focuses and listens on. */
    ref?: Ref<HTMLAnchorElement>;
};

export type TabPanelProps = PropsWithChildren<BaseTabPanelProps>;

export type TabsItemProps<T> = Omit<InteractionControlProps, "id"> & {
    /** The tab this item stands for. */
    tab: Tab<T>;
    /** Whether this tab is the selected one, so it can paint itself accordingly. */
    isSelected: boolean;
    /** The component to draw a routed tab with, for a tab that navigates rather than switching in place. */
    linkComponent?: ComponentType<TabLinkProps>;
    /** Runs when this tab is chosen. */
    onSelect: (value: T) => void;
};

export type TabsProps<T> = BaseTabsProps<T> & {
    /** The component to draw routed tabs with, for tabs that navigate rather than switching in place. */
    linkComponent?: ComponentType<TabLinkProps>;
    /** Draws the rail the tabs sit against. */
    renderGutter?: () => ReactNode;
    /**
     * Draws the marker that slides to the selected tab, behind it. The fade is handed in rather than applied: the
     * marker fades out when nothing is selected and in when something is.
     */
    renderSelectionFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /**
     * Draws the marker that slides to the tab under the pointer, or the one holding focus, behind it — a hover pill
     * gliding along the strip. It fades out when neither is on a tab. Drawn under the selection's marker where both
     * are given.
     */
    renderHighlightFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /**
     * Draws one tab. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a row.
     */
    renderTab: (tab: Tab<T>, flags: InteractionFlags, placement: PlacementRect | undefined) => ReactNode;
};
