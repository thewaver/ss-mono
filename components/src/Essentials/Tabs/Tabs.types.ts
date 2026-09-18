import type { Accessor, Component, JSX, ParentProps } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type TabsDir = "column" | "row";

export type TabLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type Tab<T> = {
    value: T;
    href?: string;
    isDisabled?: boolean;
    id?: string;
    panelId?: string;
};

export type TabPanelProps = ParentProps<
    AccessorProps<{
        /** Identifies the panel, so the tab that owns it can point at it. */
        id: string;
        /** Identifies the tab this panel belongs to, so the panel can point back. */
        tabId: string;
    }>
>;

export type TabsItemProps<T> = AccessorProps<
    Omit<InteractionControlProps, "id"> & {
        /** Whether this tab is the selected one, so it can paint itself accordingly. */
        isSelected: boolean;
        /** The component to draw a routed tab with, for a tab that navigates rather than switching in place. */
        linkComponent?: Component<TabLinkProps>;
    }
> & {
    /** The tab this item stands for. */
    tab: MaybeAccessor<Tab<T>>;
    /** Runs when this tab is chosen. */
    onSelect: (value: T) => void;
};

export type TabsProps<T> = AccessorProps<{
    /** Whether the tabs run across the page or down it, which also decides which arrow keys walk them. */
    dir?: TabsDir;
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
    linkComponent?: Component<TabLinkProps>;
    /** Draws the rail the tabs sit against. */
    renderGutter?: () => JSX.Element;
    /** Draws the marker that follows the selected tab. The fade is handed in rather than applied. */
    renderFloater?: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
}> & {
    /** The tabs, in the order they are shown. */
    tabs: MaybeAccessor<Tab<T>[]>;
    /** Which tab is selected. It is the only thing that selects one; the strip never decides that for itself. */
    selectedValue: MaybeAccessor<T | undefined>;
    /** Arranges the tabs, for a strip that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the tabs do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Draws one tab. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a row.
     */
    renderTab: (
        getTab: Accessor<Tab<T>>,
        getFlags: () => InteractionFlags,
        getPlacement: () => PlacementRect | undefined,
    ) => JSX.Element;
    /** Runs when a different tab is chosen. */
    onSelectionChange?: (value: T) => void;
};
