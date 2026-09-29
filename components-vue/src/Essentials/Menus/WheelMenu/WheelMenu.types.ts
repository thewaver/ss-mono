import type { VNodeChild } from "vue";

import type { BandDefs, InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

import type { MenuItem, MenuProps, MenuSlots } from "../Menu/Menu.types";

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
    renderContent: (flags: InteractionFlags<MenuItemFlags>) => VNodeChild;
};

export type WheelMenuProps<T> = Omit<MenuProps<T>, "items" | "checked" | "onUpdate:checked" | "computeLayout"> & {
    /** How much of the circle the items are spread over. */
    "spreadDegrees"?: number;
    /** How much of the middle is left empty, which is where the close control sits. */
    "holeRadius"?: number;
    /** How thick one level's band is. */
    "bandWidth"?: number;
    /** The space between one level's band and the next. */
    "levelGap"?: number;
    /** The items, in the order they sit round the wheel. */
    "items": WheelMenuItem<T>[];
    /**
     * Which values are currently checked, for the checkbox and radio items among them. Left out, no item is ever
     * checked.
     */
    "checked"?: T[];
    /** Receives the values checked after a checkbox or radio item is picked, which is what `v-model:checked` binds. */
    "onUpdate:checked"?: (checked: T[]) => void;
    /** How the items sit on their band, for the parts of the arrangement the wheel does not decide itself. */
    "layoutDefs"?: Omit<BandDefs, "holeRatio" | "spreadDegrees" | "computeItemArcs">;
    /** The control in the hole that closes the menu. */
    "closerDefs"?: WheelMenuCloserDefs;
};

export type WheelMenuSlots<T> = MenuSlots<T>;
