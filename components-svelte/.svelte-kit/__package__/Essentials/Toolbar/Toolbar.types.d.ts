import type { Snippet } from "svelte";
import type { InteractionFlags, MenuFlags, PlacementLayoutFn, ProximityEffectFn, ToolbarAction } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";
import type { MenuItem, MenuRenderItem, MenuRenderPopup } from "../Menus/Menu/Menu.types.js";
export type MenubarAction<T> = ToolbarAction<T> & {
    /**
     * The menu this word opens. When the word is collapsed into the overflow menu it becomes an item there, and these
     * become its submenu.
     */
    items: MenuItem<T>[];
};
export type ToolbarSharedProps<T> = {
    /** The space between actions. */
    gap?: number;
    /** Names the bar for assistive technology. The role requires a name, so there is no way to leave it out. */
    ariaLabel: string;
    /** Names the overflow menu for assistive technology. */
    overflowAriaLabel?: string;
    /** Arranges the actions, for a bar that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the actions do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Draws the control that opens the overflow menu. */
    renderOverflowTrigger: Snippet<[flags: InteractionFlags<MenuFlags>]>;
    /** Runs when an action is activated, whether from the bar or from the overflow menu. */
    onActivate: (value: T) => void;
};
export type ToolbarButtonsProps<T> = {
    /**
     * What the bar is and what its actions are. A toolbar's actions are buttons; a menubar's are words that each open
     * a menu. It is fixed by the preset, which is why neither `Toolbar` nor `Menubar` takes it.
     */
    role: "toolbar";
    /** The actions, in the order they are shown. Whatever does not fit moves into the overflow menu. */
    actions: ToolbarAction<T>[];
    /**
     * Which actions are pressed. Bind it with `bind:pressedValues`. A toolbar holds actions that do something; with
     * this, its actions hold states that stay pressed, the way Bold and Italic do in an editor.
     *
     * Every action becomes a toggle button: one whose value is in the list is announced as pressed and the rest as
     * not pressed, and the painter is told which through `isPressed`. Pressing an action adds its value to the list
     * or takes it out, and `onActivate` still runs. An action collapsed into the overflow menu becomes a checkbox item
     * there, checked from the same list, so its state survives the collapse. Left out, the actions are ordinary
     * buttons and nothing is announced as pressed.
     */
    pressedValues?: T[];
    /** Draws one action. */
    renderAction: Snippet<[action: ToolbarAction<T>, flags: InteractionFlags]>;
    /** Draws one item inside the overflow menu. */
    renderOverflowItem: MenuRenderItem<T>;
    /** Draws the surface the overflow menu's items sit on. */
    renderOverflowPopup: MenuRenderPopup;
};
export type ToolbarMenusProps<T> = {
    /**
     * What the bar is and what its actions are. A toolbar's actions are buttons; a menubar's are words that each open
     * a menu. It is fixed by the preset, which is why neither `Toolbar` nor `Menubar` takes it.
     */
    role: "menubar";
    /**
     * The words, in the order they are shown, each carrying the menu it opens. Whatever does not fit moves into the
     * overflow menu, where a word becomes an item whose submenu is its menu.
     */
    actions: MenubarAction<T>[];
    /**
     * Which values are currently checked, for the checkbox and radio items in any of the menus. Bind it with
     * `bind:checked`. One list serves every menu, so an item keeps its state when its word is collapsed into the
     * overflow menu.
     */
    checked?: T[];
    /** How far a submenu is held clear of the item that opens it, in every menu the bar opens. */
    submenuOffset?: Point2d;
    /** Draws one word. It is told whether that word's menu is open. */
    renderAction: Snippet<[action: MenubarAction<T>, flags: InteractionFlags<MenuFlags>]>;
    /** Draws one item, in every menu the bar opens, the overflow menu included. */
    renderItem: MenuRenderItem<T>;
    /** Draws the surface the items sit on, in every menu the bar opens, the overflow menu included. */
    renderPopup: MenuRenderPopup;
};
export type ToolbarCompositeProps<T> = ToolbarSharedProps<T> & (ToolbarButtonsProps<T> | ToolbarMenusProps<T>);
export type ToolbarProps<T> = ToolbarSharedProps<T> & Omit<ToolbarButtonsProps<T>, "role">;
