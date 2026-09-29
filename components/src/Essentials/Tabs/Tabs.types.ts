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

export type TabsFloaterBounds = {
    top: string;
    left: string;
    width: string;
    height: string;
    transform?: string;
};

export type TabsKeyStep<T> = {
    index: number;
    value: T;
    isSelecting: boolean;
};
