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

export namespace PlacementLayoutDefaults {
    export const ARC_DEFAULTS: Required<ArcDefs> = {
        curveHeightRatio: 1,
        spreadDegrees: 180,
        facingDegrees: -90,
        tiltRatio: 0,
        itemWidthRatio: 0.25,
        itemHeightRatio: 1,
    };

    export const CLIFF_DEFAULTS: Required<CliffDefs> = {
        cliffStepRatio: 1.5,
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

    export const BAND_DEFAULTS: Required<Omit<BandDefs, "computeItemArcs">> = {
        spreadDegrees: 360,
        facingDegrees: -90,
        holeRatio: 0.5,
        wedgeGapDegrees: 3,
        tiltRatio: 0,
        itemRadiusRatio: 0.5,
        itemHeightRatio: 1,
        itemMaxWidthRatio: 1,
    };

    export const ROW_DEFAULTS: Required<RowDefs> = {
        gapRatio: 0,
        itemHeightRatio: 1,
    };

    export const WHORL_DEFAULTS: Required<WhorlDefs> = {
        itemStepRatio: 0.75,
        whorlStepRatio: 0.75,
    };

    export const ZIGZAG_DEFAULTS: Required<ZigzagDefs> = {
        segmentLength: 2,
    };

    export const DEFAULTS_BY_FAMILY = {
        arc: ARC_DEFAULTS,
        cliff: CLIFF_DEFAULTS,
        column: COLUMN_DEFAULTS,
        honeycomb: HONEYCOMB_DEFAULTS,
        ring: BAND_DEFAULTS,
        row: ROW_DEFAULTS,
        whorl: WHORL_DEFAULTS,
        zigzag: ZIGZAG_DEFAULTS,
    };
}
