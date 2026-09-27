import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import type { MenuItemKind } from "../Menus/Menu/Menu.types";

export type ToolbarRole = "toolbar" | "menubar";

export type ToolbarCollapse = "auto" | "never" | "always";

export type ToolbarAction<T> = {
    value: T;
    collapse?: ToolbarCollapse;
    isDisabled?: boolean;
    /**
     * Keeps this action in the arrow-key walk while it is disabled, so focus can land on it and a reader hears its name
     * and that it is unavailable. It still cannot be activated. The flag travels with the action into the overflow
     * menu, where the menu item keeps it reachable the same way.
     */
    isReachableWhenDisabled?: boolean;
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

export type ToolbarOverflowSource<T, TItem> = ToolbarAction<T> & {
    items?: TItem[];
};

export type ToolbarOverflowItem<T, TItem> = {
    value: T;
    kind?: MenuItemKind;
    items?: TItem[];
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
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
