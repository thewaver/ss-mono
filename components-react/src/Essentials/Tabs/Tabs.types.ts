import type { AnchorHTMLAttributes, ComponentType, PropsWithChildren, ReactNode, Ref } from "react";

import type {
    InteractionFlags,
    PlacementLayoutFn,
    PlacementRect,
    ProximityEffectFn,
    Tab,
    TabsOrientation,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type TabLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Where the link goes. */
    href: string;
    /** Receives the link element, which is what the tab list focuses and listens on. */
    ref?: Ref<HTMLAnchorElement>;
};

export type TabPanelProps = PropsWithChildren<{
    /** Identifies the panel, so the tab that owns it can point at it. */
    id: string;
    /** Identifies the tab this panel belongs to, so the panel can point back. */
    tabId: string;
}>;

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

export type TabsProps<T> = {
    /** Whether the tabs run across the page or down it, which also decides which arrow keys walk them. */
    orientation?: TabsOrientation;
    /**
     * Selects a tab as soon as the arrow keys reach it, rather than waiting for Enter or Space. Leave it off when
     * selecting a tab is expensive.
     */
    hasAutoActivation?: boolean;
    /** The space between tabs. */
    tabGap?: number;
    /** How long the selected marker takes to slide from one tab to the next. */
    transitionDurationMs?: number;
    /** Names the tab strip for assistive technology. */
    ariaLabel?: string;
    /** The component to draw routed tabs with, for tabs that navigate rather than switching in place. */
    linkComponent?: ComponentType<TabLinkProps>;
    /** Draws the rail the tabs sit against. */
    renderGutter?: () => ReactNode;
    /** Draws the marker that follows the selected tab. The fade is handed in rather than applied. */
    renderFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /** The tabs, in the order they are shown. */
    tabs: Tab<T>[];
    /** Which tab is selected. It is the only thing that selects one; the strip never decides that for itself. */
    selectedValue: T | undefined;
    /** Arranges the tabs, for a strip that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the tabs do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Draws one tab. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a row.
     */
    renderTab: (tab: Tab<T>, flags: InteractionFlags, placement: PlacementRect | undefined) => ReactNode;
    /** Runs when a different tab is chosen. */
    onSelectionChange?: (value: T) => void;
};
