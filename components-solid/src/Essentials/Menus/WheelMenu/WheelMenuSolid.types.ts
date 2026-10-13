import type { JSX } from "solid-js";

import type { BaseWheelMenuValues, InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

import type { AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";
import type { MenuItem, MenuProps } from "../Menu/MenuSolid.types";

export type WheelMenuItem<T> = Omit<MenuItem<T>, "items"> & {
    arcDegrees?: number;
    items?: WheelMenuItem<T>[];
};

export type WheelMenuCloserDefs = {
    ariaLabel: string;
    renderContent: (getFlags: () => InteractionFlags<MenuItemFlags>) => JSX.Element;
};

export type WheelMenuProps<T> = Omit<MenuProps<T>, "items" | "checked" | "computeLayout"> &
    AccessorValues<BaseWheelMenuValues> & {
        /** The items, in the order they sit round the wheel. */
        items: MaybeAccessor<WheelMenuItem<T>[]>;
        /** Which values are currently checked, for the checkbox and radio items among them. */
        checked?: SignalSource<T[]>;
        /** The control in the hole that closes the menu. */
        closerDefs?: WheelMenuCloserDefs;
    };
