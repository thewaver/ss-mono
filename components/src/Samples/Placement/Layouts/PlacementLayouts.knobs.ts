import type { SampleKnobs } from "../../Samples.types";
import type { ArcDefs, BandDefs, CliffDefs, HoneycombDefs, WhorlDefs, ZigzagDefs } from "./PlacementLayouts.types";

export namespace PlacementLayoutKnobs {
    export const BAND_KNOBS: SampleKnobs<BandDefs> = {
        spreadDegrees: { kind: "number", label: "Spread (°)", min: 30, max: 360, step: 10 },
        facingDegrees: { kind: "number", label: "Facing (°)", min: -180, max: 180, step: 15 },
        holeRatio: { kind: "number", label: "Hole against the radius", min: 0, max: 0.9, step: 0.05 },
        wedgeGapDegrees: { kind: "number", label: "Gap between wedges (°)", min: 0, max: 20, step: 1 },
        tiltRatio: { kind: "number", label: "Tilt with the angle", min: 0, max: 1, step: 0.05 },
        itemRadiusRatio: { kind: "number", label: "Item across the band", min: 0, max: 1, step: 0.05 },
        itemHeightRatio: { kind: "number", label: "Item height against its width", min: 0.25, max: 2, step: 0.05 },
        itemMaxWidthRatio: { kind: "number", label: "Item width against the band", min: 0.25, max: 2, step: 0.05 },
    };

    export const ARC_KNOBS: SampleKnobs<ArcDefs> = {
        curveHeightRatio: { kind: "number", label: "Curve height against its width", min: 0.1, max: 2, step: 0.05 },
        spreadDegrees: { kind: "number", label: "Spread (°)", min: 30, max: 360, step: 10 },
        facingDegrees: { kind: "number", label: "Facing (°)", min: -180, max: 180, step: 15 },
        tiltRatio: { kind: "number", label: "Tilt with the angle", min: 0, max: 1, step: 0.05 },
        itemWidthRatio: { kind: "number", label: "Item width against the curve", min: 0.05, max: 1, step: 0.05 },
        itemHeightRatio: { kind: "number", label: "Item height against its width", min: 0.25, max: 2, step: 0.05 },
    };

    export const HONEYCOMB_KNOBS: SampleKnobs<HoneycombDefs> = {
        perRow: { kind: "number", label: "Cells per row", min: 1, max: 8, step: 1 },
        gapRatio: { kind: "number", label: "Gap against a cell", min: 0, max: 1, step: 0.05 },
    };

    export const WHORL_KNOBS: SampleKnobs<WhorlDefs> = {
        itemStepRatio: { kind: "number", label: "Step within a whorl, in item heights", min: 0.1, max: 2, step: 0.05 },
        whorlStepRatio: {
            kind: "number",
            label: "Step between whorls, in item heights",
            min: 0.1,
            max: 2,
            step: 0.05,
        },
    };

    export const ZIGZAG_KNOBS: SampleKnobs<ZigzagDefs> = {
        segmentLength: { kind: "number", label: "Items per leg", min: 2, max: 8, step: 1 },
    };

    export const CLIFF_KNOBS: SampleKnobs<CliffDefs> = {
        cliffStepRatio: { kind: "number", label: "Step between cliffs, in item heights", min: 0.5, max: 3, step: 0.05 },
    };

    export const KNOBS_BY_FAMILY = {
        arc: ARC_KNOBS,
        cliff: CLIFF_KNOBS,
        honeycomb: HONEYCOMB_KNOBS,
        ring: BAND_KNOBS,
        whorl: WHORL_KNOBS,
        zigzag: ZIGZAG_KNOBS,
    };
}
