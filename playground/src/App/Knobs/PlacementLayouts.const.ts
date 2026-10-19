import type {
    ArcDefs,
    BandDefs,
    CliffDefs,
    ColumnDefs,
    HoneycombDefs,
    RowDefs,
    WhorlDefs,
    ZigzagDefs,
} from "@thewaver/ss-components";

import type { Knobs } from "../PageComponents/Knobs/KnobDefs.types";

export namespace PlacementLayoutKnobs {
    export const ARC_KNOBS: Knobs<ArcDefs> = {
        curveHeightRatio: {
            kind: "number",
            label: "Curve height ratio",
            hint: "How round the curve is. 1 is a circle, lower flattens it, higher stretches it tall.",
            controls: "Sets ArcDefs.curveHeightRatio",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
        spreadDegrees: {
            kind: "number",
            label: "Spread (°)",
            hint: "How far round the curve sweeps. 180 is a half turn.",
            controls: "Sets ArcDefs.spreadDegrees",
            min: 30,
            max: 360,
            step: 10,
        },
        facingDegrees: {
            kind: "number",
            label: "Facing (°)",
            hint: "Which way the middle of the curve points. -90 is straight up, 0 is to the right.",
            controls: "Sets ArcDefs.facingDegrees",
            min: -180,
            max: 180,
            step: 15,
        },
        tiltRatio: {
            kind: "number",
            label: "Tilt ratio",
            hint: "How far an item leans to follow the curve. 0 leaves every item upright.",
            controls: "Sets ArcDefs.tiltRatio",
            min: 0,
            max: 1,
            step: 0.05,
        },
        itemWidthRatio: {
            kind: "number",
            label: "Item width ratio",
            hint: "How wide an item is against the whole arrangement.",
            controls: "Sets ArcDefs.itemWidthRatio",
            min: 0.05,
            max: 1,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            controls: "Sets ArcDefs.itemHeightRatio",
            min: 0.25,
            max: 2,
            step: 0.05,
        },
    };

    export const CLIFF_KNOBS: Knobs<CliffDefs> = {
        cliffStepRatio: {
            kind: "number",
            label: "Cliff step ratio",
            hint: "How far each group of three drops below the group before it.",
            controls: "Sets CliffDefs.cliffStepRatio",
            min: 0.5,
            max: 3,
            step: 0.05,
        },
    };

    export const COLUMN_KNOBS: Knobs<ColumnDefs> = {
        gapRatio: {
            kind: "number",
            label: "Gap ratio",
            hint: "The space between items, as a share of one item's height. 0 leaves them touching.",
            controls: "Sets ColumnDefs.gapRatio",
            min: 0,
            max: 2,
            step: 0.05,
        },
        itemWidthRatio: {
            kind: "number",
            label: "Item width ratio",
            hint: "How wide an item is against the whole arrangement. A column, unlike a row, picks its own width.",
            controls: "Sets ColumnDefs.itemWidthRatio",
            min: 0.05,
            max: 1,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            controls: "Sets ColumnDefs.itemHeightRatio",
            min: 0.25,
            max: 4,
            step: 0.05,
        },
    };

    export const HONEYCOMB_KNOBS: Knobs<HoneycombDefs> = {
        perRow: {
            kind: "number",
            label: "Cells per row",
            hint: "How many hexagons sit in a row before the next row starts. Rows alternate by half a cell.",
            controls: "Sets HoneycombDefs.perRow",
            min: 1,
            max: 8,
            step: 1,
        },
        gapRatio: {
            kind: "number",
            label: "Gap ratio",
            hint: "The space between cells, as a share of a cell's width. 0 packs them against each other.",
            controls: "Sets HoneycombDefs.gapRatio",
            min: 0,
            max: 1,
            step: 0.05,
        },
    };

    export const BAND_KNOBS: Knobs<BandDefs> = {
        spreadDegrees: {
            kind: "number",
            label: "Spread (°)",
            hint: "How much of the circle the items are spread over. Anything short of a full turn opens the ring into an arc.",
            controls: "Sets BandDefs.spreadDegrees",
            min: 30,
            max: 360,
            step: 10,
        },
        facingDegrees: {
            kind: "number",
            label: "Facing (°)",
            hint: "Which way the middle of the band points. -90 is straight up, 0 is to the right.",
            controls: "Sets BandDefs.facingDegrees",
            min: -180,
            max: 180,
            step: 15,
        },
        holeRatio: {
            kind: "number",
            label: "Hole ratio",
            hint: "How much of the circle is left empty in the middle, as a share of the radius. The items sit in the band that is left.",
            controls: "Sets BandDefs.holeRatio",
            min: 0,
            max: 0.9,
            step: 0.05,
        },
        wedgeGapDegrees: {
            kind: "number",
            label: "Wedge gap (°)",
            hint: "How much is trimmed off each side of an item's wedge, so neighboring wedges do not touch.",
            controls: "Sets BandDefs.wedgeGapDegrees",
            min: 0,
            max: 20,
            step: 1,
        },
        tiltRatio: {
            kind: "number",
            label: "Tilt ratio",
            hint: "How far an item leans with its position round the ring. 0 leaves every item upright, 1 turns each one to face outwards.",
            controls: "Sets BandDefs.tiltRatio",
            min: 0,
            max: 1,
            step: 0.05,
        },
        itemRadiusRatio: {
            kind: "number",
            label: "Item radius ratio",
            hint: "Where an item sits across the band: 0 hugs the hole's edge, 1 hugs the outside.",
            controls: "Sets BandDefs.itemRadiusRatio",
            min: 0,
            max: 1,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            controls: "Sets BandDefs.itemHeightRatio",
            min: 0.25,
            max: 2,
            step: 0.05,
        },
        itemMaxWidthRatio: {
            kind: "number",
            label: "Item max width ratio",
            hint: "The widest an item is allowed to get, as a share of the band's thickness. It stops items running into each other when there are only a few.",
            controls: "Sets BandDefs.itemMaxWidthRatio",
            min: 0.25,
            max: 2,
            step: 0.05,
        },
    };

    export const ROW_KNOBS: Knobs<RowDefs> = {
        gapRatio: {
            kind: "number",
            label: "Gap ratio",
            hint: "The space between items, as a share of one item's width. 0 leaves them touching.",
            controls: "Sets RowDefs.gapRatio",
            min: 0,
            max: 2,
            step: 0.05,
        },
        itemHeightRatio: {
            kind: "number",
            label: "Item height ratio",
            hint: "How tall an item is against its own width. 1 keeps it square.",
            controls: "Sets RowDefs.itemHeightRatio",
            min: 0.25,
            max: 4,
            step: 0.05,
        },
    };

    export const WHORL_KNOBS: Knobs<WhorlDefs> = {
        itemStepRatio: {
            kind: "number",
            label: "Item step ratio",
            hint: "How far an item steps from the one before it within its group of three.",
            controls: "Sets WhorlDefs.itemStepRatio",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
        whorlStepRatio: {
            kind: "number",
            label: "Whorl step ratio",
            hint: "How far each group of three steps from the group before it.",
            controls: "Sets WhorlDefs.whorlStepRatio",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
    };

    export const ZIGZAG_KNOBS: Knobs<ZigzagDefs> = {
        segmentLength: {
            kind: "number",
            label: "Segment length",
            hint: "How many items make up one leg of the walk before it turns back on itself.",
            controls: "Sets ZigzagDefs.segmentLength",
            min: 2,
            max: 8,
            step: 1,
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
