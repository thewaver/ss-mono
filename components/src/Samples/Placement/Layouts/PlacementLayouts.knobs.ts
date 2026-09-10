import type { SampleKnobs } from "../../Samples.types";
import type { ArcDefs, BandDefs, HoneycombDefs, PodiumDefs, WhorlDefs, ZigzagDefs } from "./PlacementLayouts.types";

export namespace PlacementLayoutKnobs {
    export const BAND_KNOBS: SampleKnobs<BandDefs> = {
        spreadDegrees: { kind: "number", label: "Spread (°)", min: 30, max: 360, step: 10 },
        holeRadius: { kind: "number", label: "Hole radius", min: 0, max: 140, step: 4 },
        bandWidth: { kind: "number", label: "Band width", min: 8, max: 160, step: 4 },
        levelGap: { kind: "number", label: "Gap between levels", min: 0, max: 40, step: 2 },
        wedgeGapDegrees: { kind: "number", label: "Gap between wedges (°)", min: 0, max: 20, step: 1 },
        wedgeArc: { kind: "number", label: "Wedge arc", min: 8, max: 120, step: 4 },
        tiltRatio: { kind: "number", label: "Tilt with the angle", min: 0, max: 1, step: 0.05 },
        hasCentreItem: { kind: "check", label: "First item in the hole" },
        labelRadiusRatio: { kind: "number", label: "Label across the band", min: 0, max: 1, step: 0.05 },
        labelHeightRatio: { kind: "number", label: "Label height against its width", min: 0.25, max: 2, step: 0.05 },
        labelMaxWidthRatio: { kind: "number", label: "Label width against the band", min: 0.25, max: 2, step: 0.05 },
    };

    export const ARC_KNOBS: SampleKnobs<ArcDefs> = {
        width: { kind: "number", label: "Curve width", min: 20, max: 200, step: 10 },
        height: { kind: "number", label: "Curve height", min: 20, max: 200, step: 10 },
        spreadDegrees: { kind: "number", label: "Spread (°)", min: 30, max: 360, step: 10 },
        facingDegrees: { kind: "number", label: "Facing (°)", min: -180, max: 180, step: 15 },
        tiltRatio: { kind: "number", label: "Tilt with the angle", min: 0, max: 1, step: 0.05 },
        itemWidth: { kind: "number", label: "Item width", min: 8, max: 80, step: 2 },
        itemHeight: { kind: "number", label: "Item height", min: 8, max: 80, step: 2 },
    };

    export const HONEYCOMB_KNOBS: SampleKnobs<HoneycombDefs> = {
        cellWidth: { kind: "number", label: "Cell width", min: 10, max: 80, step: 2 },
        perRow: { kind: "number", label: "Cells per row", min: 1, max: 8, step: 1 },
        gap: { kind: "number", label: "Gap between cells", min: 0, max: 20, step: 1 },
    };

    export const WHORL_KNOBS: SampleKnobs<WhorlDefs> = {
        itemSpacing: { kind: "number", label: "Spacing within a whorl", min: 1, max: 4, step: 0.25 },
        whorlSpacing: { kind: "number", label: "Spacing between whorls", min: 1, max: 8, step: 0.25 },
    };

    export const ZIGZAG_KNOBS: SampleKnobs<ZigzagDefs> = {
        segmentLength: { kind: "number", label: "Items per leg", min: 2, max: 8, step: 1 },
    };

    export const PODIUM_KNOBS: SampleKnobs<PodiumDefs> = {};

    export const KNOBS_BY_FAMILY = {
        arc: ARC_KNOBS,
        honeycomb: HONEYCOMB_KNOBS,
        podiumLozenge: PODIUM_KNOBS,
        ring: BAND_KNOBS,
        whorl: WHORL_KNOBS,
        zigzag: ZIGZAG_KNOBS,
    };
}
