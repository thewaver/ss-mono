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
        spreadDegrees: { kind: "number", label: "Spread (°)", min: 30, max: 360, step: 10 },
        facingDegrees: { kind: "number", label: "Facing (°)", min: -180, max: 180, step: 15 },
        holeRatio: { kind: "number", label: "Hole ratio", min: 0, max: 0.9, step: 0.05 },
        wedgeGapDegrees: { kind: "number", label: "Wedge gap (°)", min: 0, max: 20, step: 1 },
        tiltRatio: { kind: "number", label: "Tilt ratio", min: 0, max: 1, step: 0.05 },
        itemRadiusRatio: { kind: "number", label: "Item radius ratio", min: 0, max: 1, step: 0.05 },
        itemHeightRatio: { kind: "number", label: "Item height ratio", min: 0.25, max: 2, step: 0.05 },
        itemMaxWidthRatio: { kind: "number", label: "Item max width ratio", min: 0.25, max: 2, step: 0.05 },
    };

    export const ARC_KNOBS: SampleKnobs<ArcDefs> = {
        curveHeightRatio: { kind: "number", label: "Curve height ratio", min: 0.1, max: 2, step: 0.05 },
        spreadDegrees: { kind: "number", label: "Spread (°)", min: 30, max: 360, step: 10 },
        facingDegrees: { kind: "number", label: "Facing (°)", min: -180, max: 180, step: 15 },
        tiltRatio: { kind: "number", label: "Tilt ratio", min: 0, max: 1, step: 0.05 },
        itemWidthRatio: { kind: "number", label: "Item width ratio", min: 0.05, max: 1, step: 0.05 },
        itemHeightRatio: { kind: "number", label: "Item height ratio", min: 0.25, max: 2, step: 0.05 },
    };

    export const ROW_KNOBS: SampleKnobs<RowDefs> = {
        gapRatio: { kind: "number", label: "Gap ratio", min: 0, max: 2, step: 0.05 },
        itemHeightRatio: { kind: "number", label: "Item height ratio", min: 0.25, max: 4, step: 0.05 },
    };

    export const COLUMN_KNOBS: SampleKnobs<ColumnDefs> = {
        gapRatio: { kind: "number", label: "Gap ratio", min: 0, max: 2, step: 0.05 },
        itemWidthRatio: { kind: "number", label: "Item width ratio", min: 0.05, max: 1, step: 0.05 },
        itemHeightRatio: { kind: "number", label: "Item height ratio", min: 0.25, max: 4, step: 0.05 },
    };

    export const HONEYCOMB_KNOBS: SampleKnobs<HoneycombDefs> = {
        perRow: { kind: "number", label: "Cells per row", min: 1, max: 8, step: 1 },
        gapRatio: { kind: "number", label: "Gap ratio", min: 0, max: 1, step: 0.05 },
    };

    export const WHORL_KNOBS: SampleKnobs<WhorlDefs> = {
        itemStepRatio: { kind: "number", label: "Item step ratio", min: 0.1, max: 2, step: 0.05 },
        whorlStepRatio: {
            kind: "number",
            label: "Whorl step ratio",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
    };

    export const ZIGZAG_KNOBS: SampleKnobs<ZigzagDefs> = {
        segmentLength: { kind: "number", label: "Segment length", min: 2, max: 8, step: 1 },
    };

    export const CLIFF_KNOBS: SampleKnobs<CliffDefs> = {
        cliffStepRatio: { kind: "number", label: "Cliff step ratio", min: 0.5, max: 3, step: 0.05 },
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
