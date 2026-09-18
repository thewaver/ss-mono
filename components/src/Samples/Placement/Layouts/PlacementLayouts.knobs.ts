import type { SampleKnobs } from "../../Samples.types";
import type {
    ArcDefs,
    BandDefs,
    CliffDefs,
    ColumnDefs,
    HoneycombDefs,
    RowDefs,
    WhorlDefs,
    ZigzagDefs,
} from "./PlacementLayouts.types";

type BandBase = Required<Omit<BandDefs, "computeItemArcs">>;

export namespace PlacementLayoutKnobs {
    export const BAND_DEFAULTS: BandBase = {
        spreadDegrees: 360,
        facingDegrees: -90,
        holeRatio: 0.5,
        wedgeGapDegrees: 3,
        tiltRatio: 0,
        itemRadiusRatio: 0.5,
        itemHeightRatio: 1,
        itemMaxWidthRatio: 1,
    };

    export const ARC_DEFAULTS: Required<ArcDefs> = {
        curveHeightRatio: 1,
        spreadDegrees: 180,
        facingDegrees: -90,
        tiltRatio: 0,
        itemWidthRatio: 0.25,
        itemHeightRatio: 1,
    };

    export const ROW_DEFAULTS: Required<RowDefs> = {
        gapRatio: 0,
        itemHeightRatio: 1,
    };

    export const COLUMN_DEFAULTS: Required<ColumnDefs> = {
        gapRatio: 0,
        itemWidthRatio: 0.25,
        itemHeightRatio: 1,
    };

    export const HONEYCOMB_DEFAULTS: Required<HoneycombDefs> = {
        perRow: 3,
        gapRatio: 0,
    };

    export const WHORL_DEFAULTS: Required<WhorlDefs> = {
        itemStepRatio: 0.75,
        whorlStepRatio: 0.75,
    };

    export const CLIFF_DEFAULTS: Required<CliffDefs> = {
        cliffStepRatio: 1.5,
    };

    export const ZIGZAG_DEFAULTS: Required<ZigzagDefs> = {
        segmentLength: 2,
    };

    export const DEFAULTS_BY_FAMILY = {
        arc: ARC_DEFAULTS,
        column: COLUMN_DEFAULTS,
        row: ROW_DEFAULTS,
        honeycomb: HONEYCOMB_DEFAULTS,
        cliff: CLIFF_DEFAULTS,
        ring: BAND_DEFAULTS,
        whorl: WHORL_DEFAULTS,
        zigzag: ZIGZAG_DEFAULTS,
    };

    export const BAND_KNOBS: SampleKnobs<BandDefs> = {
        spreadDegrees: {
            kind: "number",
            label: "Spread (°)",
            hint: "How much of the circle the items are spread over. Anything short of a full turn opens the ring into an arc.",
            min: 30,
            max: 360,
            step: 10,
        },
        facingDegrees: {
            kind: "number",
            label: "Facing (°)",
            hint: "Which way the middle of the band points. -90 is straight up, 0 is to the right.",
            min: -180,
            max: 180,
            step: 15,
        },
        holeRatio: {
            kind: "number",
            label: "Hole ratio",
            hint: "How much of the circle is left empty in the middle, as a share of the radius. The items sit in the band that is left.",
            min: 0,
            max: 0.9,
            step: 0.05,
        },
        wedgeGapDegrees: {
            kind: "number",
            label: "Wedge gap (°)",
            hint: "How much is trimmed off each side of an item's wedge, so neighbouring wedges do not touch.",
            min: 0,
            max: 20,
            step: 1,
        },
        tiltRatio: {
            kind: "number",
            label: "Tilt ratio",
            hint: "How far an item leans with its position round the ring. 0 leaves every item upright, 1 turns each one to face outwards.",
            min: 0,
            max: 1,
            step: 0.05,
        },
        itemRadiusRatio: {
            kind: "number",
            label: "Item radius ratio",
            hint: "Where an item sits across the band: 0 hugs the hole's edge, 1 hugs the outside.",
            min: 0,
            max: 1,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            min: 0.25,
            max: 2,
            step: 0.05,
        },
        itemMaxWidthRatio: {
            kind: "number",
            label: "Item max width ratio",
            hint: "The widest an item is allowed to get, as a share of the band's thickness. It stops items running into each other when there are only a few.",
            min: 0.25,
            max: 2,
            step: 0.05,
        },
    };

    export const ARC_KNOBS: SampleKnobs<ArcDefs> = {
        curveHeightRatio: {
            kind: "number",
            label: "Curve height ratio",
            hint: "How round the curve is. 1 is a circle, lower flattens it, higher stretches it tall.",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
        spreadDegrees: {
            kind: "number",
            label: "Spread (°)",
            hint: "How far round the curve sweeps. 180 is a half turn.",
            min: 30,
            max: 360,
            step: 10,
        },
        facingDegrees: {
            kind: "number",
            label: "Facing (°)",
            hint: "Which way the middle of the curve points. -90 is straight up, 0 is to the right.",
            min: -180,
            max: 180,
            step: 15,
        },
        tiltRatio: {
            kind: "number",
            label: "Tilt ratio",
            hint: "How far an item leans to follow the curve. 0 leaves every item upright.",
            min: 0,
            max: 1,
            step: 0.05,
        },
        itemWidthRatio: {
            kind: "number",
            label: "Item width ratio",
            hint: "How wide an item is against the whole arrangement.",
            min: 0.05,
            max: 1,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            min: 0.25,
            max: 2,
            step: 0.05,
        },
    };

    export const ROW_KNOBS: SampleKnobs<RowDefs> = {
        gapRatio: {
            kind: "number",
            label: "Gap ratio",
            hint: "The space between items, as a share of one item's width. 0 leaves them touching.",
            min: 0,
            max: 2,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            min: 0.25,
            max: 4,
            step: 0.05,
        },
    };

    export const COLUMN_KNOBS: SampleKnobs<ColumnDefs> = {
        gapRatio: {
            kind: "number",
            label: "Gap ratio",
            hint: "The space between items, as a share of one item's height. 0 leaves them touching.",
            min: 0,
            max: 2,
            step: 0.05,
        },
        itemWidthRatio: {
            kind: "number",
            label: "Item width ratio",
            hint: "How wide an item is against the whole arrangement. A column, unlike a row, picks its own width.",
            min: 0.05,
            max: 1,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            min: 0.25,
            max: 4,
            step: 0.05,
        },
    };

    export const HONEYCOMB_KNOBS: SampleKnobs<HoneycombDefs> = {
        perRow: {
            kind: "number",
            label: "Cells per row",
            hint: "How many hexagons sit in a row before the next row starts. Rows alternate by half a cell.",
            min: 1,
            max: 8,
            step: 1,
        },
        gapRatio: {
            kind: "number",
            label: "Gap ratio",
            hint: "The space between cells, as a share of a cell's width. 0 packs them against each other.",
            min: 0,
            max: 1,
            step: 0.05,
        },
    };

    export const WHORL_KNOBS: SampleKnobs<WhorlDefs> = {
        itemStepRatio: {
            kind: "number",
            label: "Item step ratio",
            hint: "How far an item steps from the one before it within its group of three.",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
        whorlStepRatio: {
            kind: "number",
            label: "Whorl step ratio",
            hint: "How far each group of three steps from the group before it.",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
    };

    export const ZIGZAG_KNOBS: SampleKnobs<ZigzagDefs> = {
        segmentLength: {
            kind: "number",
            label: "Segment length",
            hint: "How many items make up one leg of the walk before it turns back on itself.",
            min: 2,
            max: 8,
            step: 1,
        },
    };

    export const CLIFF_KNOBS: SampleKnobs<CliffDefs> = {
        cliffStepRatio: {
            kind: "number",
            label: "Cliff step ratio",
            hint: "How far each group of three drops below the group before it.",
            min: 0.5,
            max: 3,
            step: 0.05,
        },
    };

    export const KNOBS_BY_FAMILY = {
        arc: ARC_KNOBS,
        cliff: CLIFF_KNOBS,
        column: COLUMN_KNOBS,
        honeycomb: HONEYCOMB_KNOBS,
        ring: BAND_KNOBS,
        row: ROW_KNOBS,
        whorl: WHORL_KNOBS,
        zigzag: ZIGZAG_KNOBS,
    };
}
