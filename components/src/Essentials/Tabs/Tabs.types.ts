import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

export type TabsOrientation = "horizontal" | "vertical";

export type Tab<T> = {
    /**
     * What this tab stands for. It is compared with `selectedValue` by identity to decide which tab is selected, and
     * handed to `onSelectionChange` when this one is chosen.
     */
    value: T;
    /**
     * Turns the tab into a link to this address, drawn with `linkComponent`. Choosing it still reports through
     * `onSelectionChange`; without it the tab is a button that switches in place.
     */
    href?: string;
    /**
     * Marks the tab unavailable: it cannot be selected, it is announced as disabled, and the arrow keys skip it unless
     * `isReachableWhenDisabled` is set.
     */
    isDisabled?: boolean;
    /**
     * Keeps this tab in the arrow-key walk while it is disabled, so focus can land on it and a reader hears its name
     * and that it is unavailable. It still cannot be selected, by pointer, by key or by the arrows reaching it.
     */
    isReachableWhenDisabled?: boolean;
    /** Identifies the tab, so the panel it owns can point back at it through `TabPanel`'s `tabId`. */
    id?: string;
    /** Identifies the panel this tab controls, so the tab can point at it. Match it to that `TabPanel`'s `id`. */
    panelId?: string;
};

export type TabsKeyStep<T> = {
    index: number;
    value: T;
    isSelecting: boolean;
};

export type BaseTabsValues<T> = {
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
    /** The tabs, in the order they are shown. */
    tabs: Tab<T>[];
    /** Which tab is selected. It is the only thing that selects one; the strip never decides that for itself. */
    selectedValue: T | undefined;
};

export type BaseTabsCbs<T> = {
    /** Arranges the tabs, for a strip that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the tabs do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Runs when a different tab is chosen. */
    onSelectionChange?: (value: T) => void;
};

export type BaseTabsProps<T> = BaseTabsValues<T> & BaseTabsCbs<T>;

export type BaseTabPanelValues = {
    /** Identifies the panel, so the tab that owns it can point at it. */
    id: string;
    /** Identifies the tab this panel belongs to, so the panel can point back. */
    tabId: string;
};

export type BaseTabPanelProps = BaseTabPanelValues;
