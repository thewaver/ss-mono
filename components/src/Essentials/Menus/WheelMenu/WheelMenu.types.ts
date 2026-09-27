import type { BandDefs } from "../../../Generators/PlacementLayouts/PlacementLayouts.types";

export type WheelMenuArcRecord = {
    arcDegrees?: number;
    items?: WheelMenuArcRecord[];
};

export type WheelMenuLayoutDefs = {
    items: WheelMenuArcRecord[];
    spreadDegrees?: number;
    holeRadius?: number;
    bandWidth?: number;
    levelGap?: number;
    layoutDefs?: Omit<BandDefs, "holeRatio" | "spreadDegrees" | "computeItemArcs">;
    hasCloser: boolean;
};
