import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { BandDefs } from "../../../Generators/PlacementLayouts/PlacementLayouts.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";
import type { MenuItem, MenuItemFlags, MenuProps } from "../Menu/Menu.types";

export type WheelMenuItem<T> = Omit<MenuItem<T>, "items"> & {
    arcDegrees?: number;
    items?: WheelMenuItem<T>[];
};

export type WheelMenuCloserDefs = {
    ariaLabel: string;
    renderContent: (getFlags: () => InteractionFlags<MenuItemFlags>) => JSX.Element;
};

export type WheelMenuProps<T> = Omit<MenuProps<T>, "items" | "checkedSignal" | "computeLayout"> &
    AccessorProps<{
        /** How much of the circle the items are spread over. */
        spreadDegrees?: number;
        /** How much of the middle is left empty, which is where the close control sits. */
        holeRadius?: number;
        /** How thick one level's band is. */
        bandWidth?: number;
        /** The space between one level's band and the next. */
        levelGap?: number;
    }> & {
        /** The items, in the order they sit round the wheel. */
        items: MaybeAccessor<WheelMenuItem<T>[]>;
        /** Which values are currently checked, for the checkbox and radio items among them. */
        checkedSignal?: SignalSource<T[]>;
        /** How the items sit on their band, for the parts of the arrangement the wheel does not decide itself. */
        layoutDefs?: Omit<BandDefs, "holeRatio" | "spreadDegrees" | "computeItemArcs">;
        /** The control in the hole that closes the menu. */
        closerDefs?: WheelMenuCloserDefs;
    };
