import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";
import type { MenuFlags, MenuRenderItem, MenuRenderPopup } from "../Menus/Menu/Menu.types";

export type ToolbarCollapse = "auto" | "never" | "always";

export type ToolbarAction<T> = {
    value: T;
    collapse?: ToolbarCollapse;
    isDisabled?: boolean;
};

export type ToolbarCutDefs = {
    widths: number[];
    collapses: ToolbarCollapse[];
    available: number;
    overflowWidth: number;
    gap: number;
};

export type ToolbarCut = {
    shownIndexes: number[];
    collapsedIndexes: number[];
};

export type ToolbarProps<T> = AccessorProps<{
    /** The space between actions. */
    gap?: number;
    /** Names the toolbar for assistive technology. */
    ariaLabel: string;
    /** Names the overflow menu for assistive technology. */
    overflowAriaLabel?: string;
    /** Draws the surface the overflow menu's items sit on. */
    renderOverflowPopup: MenuRenderPopup;
}> & {
    /** The actions, in the order they are shown. Whatever does not fit moves into the overflow menu. */
    actions: MaybeAccessor<ToolbarAction<T>[]>;
    /** Arranges the actions, for a toolbar that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the actions do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Draws one action. */
    renderAction: (getAction: Accessor<ToolbarAction<T>>, getFlags: () => InteractionFlags) => JSX.Element;
    /** Draws the control that opens the overflow menu. */
    renderOverflowTrigger: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
    /** Draws one item inside the overflow menu. */
    renderOverflowItem: MenuRenderItem<T>;
    /** Runs when an action is activated, whether from the bar or from the overflow menu. */
    onActivate: (value: T) => void;
};
