import type { Snippet } from "svelte";

import type { BaseWheelMenuProps, InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

import type { MenuItem, MenuProps } from "../Menu/Menu.types.js";

export type WheelMenuItem<T> = Omit<MenuItem<T>, "items"> & {
    /**
     * How much of the circle this item's wedge takes. Left out, the item shares what the others leave. A block that
     * asks for more than the spread is scaled down to fit it.
     */
    arcDegrees?: number;
    /** The items of this item's band, one further out. An item carrying them opens a band rather than being picked. */
    items?: WheelMenuItem<T>[];
};

export type WheelMenuCloserDefs = {
    /** Names the close control, whose painter draws a glyph and nothing else. */
    ariaLabel: string;
    /** Draws the close control. It is handed the control's flags, so it can show being highlighted. */
    renderContent: Snippet<[flags: InteractionFlags<MenuItemFlags>]>;
};

export type WheelMenuProps<T> = Omit<MenuProps<T>, "items" | "checked" | "computeLayout"> &
    BaseWheelMenuProps & {
        /** The items, in the order they sit round the wheel. */
        items: WheelMenuItem<T>[];
        /**
         * Which values are currently checked, for the checkbox and radio items among them. Bind it with `bind:checked`;
         * the menu writes it when a checkbox or radio item is picked.
         */
        checked?: T[];
        /** The control in the hole that closes the menu. */
        closerDefs?: WheelMenuCloserDefs;
    };
