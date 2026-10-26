import type {
    PlacementLayout,
    PlacementLayoutDefs,
    PlacementLayoutFn,
} from "../../Abstracts/Placement/Placement.types";

export type SizedLayout = PlacementLayout & { extent: number };

export type SizedLayoutFn = (defs: PlacementLayoutDefs) => SizedLayout;

export type FittedLayoutFn = PlacementLayoutFn;

export type BandDefs = {
    /**
     * How much of a turn the items run round, in degrees, from `0` to `360`. Below a whole turn the band opens into an
     * arc of wedges, and the box stays the whole circle, so the side it does not cover is left empty and the center
     * stays the middle of the box. Defaults to `360`.
     */
    spreadDegrees?: number;
    /** Which way the middle of the run points, in degrees: `-90` is up, `0` is right. Defaults to `-90`. */
    facingDegrees?: number;
    /** Where the band's inner edge sits, as a share of the outer radius, from `0` (no hole) to `1`. Defaults to `0.5`. */
    holeRatio?: number;
    /** The angle left empty between one wedge and the next, in degrees. Defaults to `3`. */
    wedgeGapDegrees?: number;
    /**
     * How far each item turns with its place on the ring, as a share of that place's angle. `0` keeps every item
     * upright. Defaults to `0`.
     */
    tiltRatio?: number;
    /** Where across the band an item's center sits: `0` is the inner edge, `1` the outer. Defaults to `0.5`. */
    itemRadiusRatio?: number;
    /** An item's height against its own width. Defaults to `1`. */
    itemHeightRatio?: number;
    /**
     * The widest an item may be, as a share of the band's thickness. Short of that, an item is as wide as its wedge
     * where it sits, so items never overlap. Defaults to `1`.
     */
    itemMaxWidthRatio?: number;
    /**
     * Returns the angle each item asks for, in degrees, by position; an item answering `undefined` shares what is
     * left evenly. The answers are scaled together to fill the spread.
     */
    computeItemArcs?: () => (number | undefined)[];
};

export type ArcDefs = {
    /**
     * The box's height against the width it is given, which is also the oval's. `1` is a circle in a square box,
     * lower is a flatter oval in a shallower box. Defaults to `1`.
     */
    ovalHeightRatio?: number;
    /**
     * How much of the oval the items run along, in degrees. The drawn piece is grown or shrunk to fit the box, so a
     * narrower spread is a smaller piece of the oval drawn just as large. Capped below a whole turn by the item
     * count, so the two ends never meet. Defaults to `180`.
     */
    spreadDegrees?: number;
    /** Which way the middle of the piece points, in degrees: `-90` is up, `0` is right. Defaults to `-90`. */
    facingDegrees?: number;
    /**
     * How far each item turns with its place on the oval, as a share of that place's angle. `0` keeps every item
     * upright. Defaults to `0`.
     */
    tiltRatio?: number;
    /**
     * An item's width, as a share of the width the box is given. Never changes the box: the curve shrinks instead
     * until every item fits. Defaults to `0.25`.
     */
    itemWidthRatio?: number;
    /**
     * An item's height, as a share of the width the box is given — not of the item's own width, so it does not
     * change with `itemWidthRatio`. Never changes the box. Defaults to `0.25`.
     */
    itemHeightRatio?: number;
};

export type RowDefs = {
    gapRatio?: number;
    itemHeightRatio?: number;
};

export type ColumnDefs = {
    gapRatio?: number;
    itemHeightRatio?: number;
};

export type HoneycombDefs = {
    perRow?: number;
    gapRatio?: number;
};

export type WhorlDefs = {
    itemStepRatio?: number;
    whorlStepRatio?: number;
};

export type ZigzagDefs = {
    segmentLength?: number;
};

export type CliffDefs = {
    cliffStepRatio?: number;
};

export type PlacementLayoutEntry =
    | { family: "ring"; defs?: BandDefs }
    | { family: "arc"; defs?: ArcDefs }
    | { family: "row"; defs?: RowDefs }
    | { family: "column"; defs?: ColumnDefs }
    | { family: "honeycomb"; defs?: HoneycombDefs }
    | { family: "cliff"; defs?: CliffDefs }
    | { family: "whorl"; defs?: WhorlDefs }
    | { family: "zigzag"; defs?: ZigzagDefs };

export type PlacementLayoutFamily = PlacementLayoutEntry["family"];
