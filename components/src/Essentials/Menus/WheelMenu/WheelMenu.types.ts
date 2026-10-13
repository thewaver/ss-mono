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

export type BaseWheelMenuValues = {
    /** How much of the circle the items are spread over. */
    spreadDegrees?: number;
    /** How much of the middle is left empty, which is where the close control sits. */
    holeRadius?: number;
    /** How thick one level's band is. */
    bandWidth?: number;
    /** The space between one level's band and the next. */
    levelGap?: number;
    /** How the items sit on their band, for the parts of the arrangement the wheel does not decide itself. */
    layoutDefs?: Omit<BandDefs, "holeRatio" | "spreadDegrees" | "computeItemArcs">;
};

export type BaseWheelMenuProps = BaseWheelMenuValues;
