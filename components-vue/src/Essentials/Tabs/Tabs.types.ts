import type { AnchorHTMLAttributes, Component, VNodeChild } from "vue";

import type { BaseTabPanelProps, BaseTabsProps, InteractionFlags, PlacementRect, Tab } from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type TabLinkProps = AnchorHTMLAttributes & {
    /** Where the link goes. */
    href: string;
};

export type TabPanelProps = BaseTabPanelProps;

export type TabPanelSlots = {
    /** The panel's contents. */
    default?: () => VNodeChild;
};

export type TabsItemProps<T> = Omit<InteractionControlProps, "id"> & {
    /** The tab this item stands for. */
    tab: Tab<T>;
    /** Whether this tab is the selected one, so it can paint itself accordingly. */
    isSelected: boolean;
    /**
     * The component to draw a routed tab with, for a tab that navigates rather than switching in place. Its `$el` is
     * what the tab list focuses and listens on.
     */
    linkComponent?: Component<TabLinkProps>;
    /** Runs when this tab is chosen. */
    onSelect: (value: T) => void;
};

export type TabsProps<T> = BaseTabsProps<T> & {
    /**
     * The component to draw routed tabs with, for tabs that navigate rather than switching in place. Its `$el` is
     * what the tab list focuses and listens on.
     */
    linkComponent?: Component<TabLinkProps>;
};

export type TabsSlots<T> = {
    /** Draws the rail the tabs sit against. */
    renderGutter?: () => VNodeChild;
    /**
     * Draws the marker that slides to the selected tab, behind it. The fade is handed in rather than applied: the
     * marker fades out when nothing is selected and in when something is.
     */
    renderSelectionFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws the marker that slides to the tab under the pointer, or the one holding focus, behind it — a hover pill
     * gliding along the strip. It fades out when neither is on a tab. Drawn under the selection's marker where both
     * are given.
     */
    renderHighlightFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws one tab. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a row.
     */
    renderTab: (props: { tab: Tab<T>; flags: InteractionFlags; placement: PlacementRect | undefined }) => VNodeChild;
};
