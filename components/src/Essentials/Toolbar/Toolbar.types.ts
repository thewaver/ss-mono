import type { Point2d } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import type { OverflowCollapse } from "../../Abstracts/Overflow/Overflow.types";
import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { MenuItemKind } from "../Menus/Menu/Menu.types";

export type ToolbarRole = "toolbar" | "menubar";

export type ToolbarActionRecord<T, TTooltipDefs = unknown> = {
    value: T;
    collapse?: OverflowCollapse;
    isDisabled?: boolean;
    /**
     * Keeps this action in the arrow-key walk while it is disabled, so focus can land on it and a reader hears its name
     * and that it is unavailable. It still cannot be activated. The flag travels with the action into the overflow
     * menu, where the menu item keeps it reachable the same way.
     */
    isReachableWhenDisabled?: boolean;
    /**
     * A tooltip for this action. It travels with the action into the overflow menu, where the menu item shows the
     * same tooltip, so what an action says about itself does not depend on whether it fitted.
     */
    tooltipDefs?: TTooltipDefs;
};

export type ToolbarOverflowSource<T, TItem, TTooltipDefs = unknown> = ToolbarActionRecord<T, TTooltipDefs> & {
    items?: TItem[];
};

export type ToolbarOverflowItem<T, TItem, TTooltipDefs = unknown> = {
    value: T;
    kind?: MenuItemKind;
    items?: TItem[];
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: TTooltipDefs;
};

export type ToolbarOverflowDefs = {
    hasSubmenus: boolean;
    isPressable: boolean;
};

export type ToolbarKeyDefs = {
    isFromRow: boolean;
    stops: number[];
    hasOverflow: boolean;
    openStop: number | undefined;
    rovingStop: number | undefined;
    isPlaced: boolean;
    direction: NavigatorDirection;
};

export type ToolbarKeyStep = {
    stop: number;
    isSwitch: boolean;
};

export type BaseToolbarSharedValues = {
    /** The space between actions. */
    gap?: number;
    /** Names the bar for assistive technology. The role requires a name, so there is no way to leave it out. */
    ariaLabel: string;
    /** Names the overflow menu for assistive technology. */
    overflowAriaLabel?: string;
};

export type BaseToolbarSharedCbs<T> = {
    /** Arranges the actions, for a bar that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the actions do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Runs when an action is activated, whether from the bar or from the overflow menu. */
    onActivate: (value: T) => void;
};

export type BaseToolbarSharedProps<T> = BaseToolbarSharedValues & BaseToolbarSharedCbs<T>;

export type BaseToolbarButtonsValues = {
    /**
     * What the bar is and what its actions are. A toolbar's actions are buttons; a menubar's are words that each open
     * a menu. It is fixed by the preset, which is why neither `Toolbar` nor `Menubar` takes it.
     */
    role: "toolbar";
};

export type BaseToolbarButtonsProps = BaseToolbarButtonsValues;

export type BaseToolbarMenusValues = {
    /**
     * What the bar is and what its actions are. A toolbar's actions are buttons; a menubar's are words that each open
     * a menu. It is fixed by the preset, which is why neither `Toolbar` nor `Menubar` takes it.
     */
    role: "menubar";
    /** How far a submenu is held clear of the item that opens it, in every menu the bar opens. */
    submenuOffset?: Point2d;
};

export type BaseToolbarMenusProps = BaseToolbarMenusValues;
