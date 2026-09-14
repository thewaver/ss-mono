import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { BandDefs } from "../../../Samples/Placement/Layouts/PlacementLayouts.types";
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
        spreadDegrees?: number;
        holeRadius?: number;
        bandWidth?: number;
        levelGap?: number;
    }> & {
        items: MaybeAccessor<WheelMenuItem<T>[]>;
        checkedSignal?: SignalSource<T[]>;
        layoutDefs?: Omit<BandDefs, "holeRatio" | "spreadDegrees" | "computeItemArcs">;
        closerDefs?: WheelMenuCloserDefs;
    };
