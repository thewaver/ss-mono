import type { Accessor, JSX } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";
import type { MenuFlags, MenuItem, MenuRenderItem, MenuRenderPopup } from "../Menus/Menu/Menu.types";

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

export type MenubarAction<T> = ToolbarAction<T> & {
    /**
     * The menu this word opens. When the word is collapsed into the overflow menu it becomes an item there, and these
     * become its submenu.
     */
    items: MenuItem<T>[];
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

export type ToolbarSharedProps<T> = AccessorProps<{
    /** The space between actions. */
    gap?: number;
    /** Names the bar for assistive technology. The role requires a name, so there is no way to leave it out. */
    ariaLabel: string;
    /** Names the overflow menu for assistive technology. */
    overflowAriaLabel?: string;
}> & {
    /** Arranges the actions, for a bar that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the actions do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Draws the control that opens the overflow menu. */
    renderOverflowTrigger: (getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
    /** Runs when an action is activated, whether from the bar or from the overflow menu. */
    onActivate: (value: T) => void;
};

export type ToolbarButtonsProps<T> = AccessorProps<{
    /** Draws the surface the overflow menu's items sit on. */
    renderOverflowPopup: MenuRenderPopup;
}> & {
    /**
     * What the bar is and what its actions are. A toolbar's actions are buttons; a menubar's are words that each open
     * a menu. It is fixed by the preset, which is why neither `Toolbar` nor `Menubar` takes it.
     */
    role: "toolbar";
    /** The actions, in the order they are shown. Whatever does not fit moves into the overflow menu. */
    actions: MaybeAccessor<ToolbarAction<T>[]>;
    /**
     * Which actions are pressed. A toolbar holds actions that do something; with this, its actions hold states that
     * stay pressed, the way Bold and Italic do in an editor.
     *
     * Every action becomes a toggle button: one whose value is in the list is announced as pressed and the rest as
     * not pressed, and the painter is told which through `isPressed`. Pressing an action adds its value to the list
     * or takes it out, and `onActivate` still runs. An action collapsed into the overflow menu becomes a checkbox item
     * there, checked from the same list, so its state survives the collapse. Left out, the actions are ordinary
     * buttons and nothing is announced as pressed.
     */
    pressedValuesSignal?: SignalSource<T[]>;
    /** Draws one action. */
    renderAction: (getAction: Accessor<ToolbarAction<T>>, getFlags: () => InteractionFlags) => JSX.Element;
    /** Draws one item inside the overflow menu. */
    renderOverflowItem: MenuRenderItem<T>;
};

export type ToolbarMenusProps<T> = AccessorProps<{
    /** How far a submenu is held clear of the item that opens it, in every menu the bar opens. */
    submenuOffset?: Point2d;
    /** Draws the surface the items sit on, in every menu the bar opens, the overflow menu included. */
    renderPopup: MenuRenderPopup;
}> & {
    /**
     * What the bar is and what its actions are. A toolbar's actions are buttons; a menubar's are words that each open
     * a menu. It is fixed by the preset, which is why neither `Toolbar` nor `Menubar` takes it.
     */
    role: "menubar";
    /**
     * The words, in the order they are shown, each carrying the menu it opens. Whatever does not fit moves into the
     * overflow menu, where a word becomes an item whose submenu is its menu.
     */
    actions: MaybeAccessor<MenubarAction<T>[]>;
    /**
     * Which values are currently checked, for the checkbox and radio items in any of the menus. One list serves every
     * menu, so an item keeps its state when its word is collapsed into the overflow menu.
     */
    checkedSignal?: SignalSource<T[]>;
    /** Draws one word. It is told whether that word's menu is open. */
    renderAction: (getAction: Accessor<MenubarAction<T>>, getFlags: () => InteractionFlags<MenuFlags>) => JSX.Element;
    /** Draws one item, in every menu the bar opens, the overflow menu included. */
    renderItem: MenuRenderItem<T>;
};

export type ToolbarCompositeProps<T> = ToolbarSharedProps<T> & (ToolbarButtonsProps<T> | ToolbarMenusProps<T>);

export type ToolbarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarButtonsProps<T>, "role">;
