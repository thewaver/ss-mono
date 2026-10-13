import type { Component, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

import type { BaseTabPanelProps, BaseTabsProps, InteractionFlags, PlacementRect, Tab } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type TabLinkProps = HTMLAnchorAttributes & {
    /**
     * Where the link goes. Spread every prop onto the anchor: they carry the tab list's hold on the element, which is
     * what it focuses and listens on.
     */
    href: string;
};

export type TabPanelProps = BaseTabPanelProps & {
    /** What the panel holds. */
    children?: Snippet;
};

export type TabsItemProps<T> = Omit<InteractionControlProps, "id"> & {
    /** The tab this item stands for. */
    tab: Tab<T>;
    /** Whether this tab is the selected one, so it can paint itself accordingly. */
    isSelected: boolean;
    /** The component to draw a routed tab with, for a tab that navigates rather than switching in place. */
    linkComponent?: Component<TabLinkProps>;
    /** Runs when this tab is chosen. */
    onSelect: (value: T) => void;
};

export type TabsProps<T> = BaseTabsProps<T> & {
    /** The component to draw routed tabs with, for tabs that navigate rather than switching in place. */
    linkComponent?: Component<TabLinkProps>;
    /** Draws the rail the tabs sit against. */
    renderGutter?: Snippet;
    /**
     * Draws the marker that slides to the selected tab, behind it. The fade is handed in rather than applied: the
     * marker fades out when nothing is selected and in when something is.
     */
    renderSelectionFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /**
     * Draws the marker that slides to the tab under the pointer, or the one holding focus, behind it — a hover pill
     * gliding along the strip. It fades out when neither is on a tab. Drawn under the selection's marker where both
     * are given.
     */
    renderHighlightFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /**
     * Draws one tab. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a row.
     */
    renderTab: Snippet<[tab: Tab<T>, flags: InteractionFlags, placement: PlacementRect | undefined]>;
};
