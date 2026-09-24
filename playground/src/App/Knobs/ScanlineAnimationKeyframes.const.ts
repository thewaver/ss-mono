import type {
    ScanlineHorizontalBrightnessOpts,
    ScanlineHorizontalGrayscaleOpts,
    ScanlineHorizontalHueOpts,
    ScanlineHorizontalSnakeOpts,
    ScanlineHorizontalSplitOpts,
    ScanlineHorizontalStretchOpts,
    _ScanlineHorizontalDropoutOpts,
    _ScanlineHorizontalInterlaceOpts,
    _ScanlineHorizontalRollOpts,
    _ScanlineHorizontalSkewOpts,
    _ScanlineHorizontalWaveOpts,
} from "@thewaver/ss-components";

import type { Knobs } from "../PageComponents/Knobs/Knobs.types";

export namespace ScanlineAnimationKeyframeKnobs {
    export const SNAKE_KNOBS: Knobs<ScanlineHorizontalSnakeOpts> = {
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far a row slides sideways at the peak of the sweep, as a share of its own width.",
            min: 5,
            max: 25,
            step: 5,
        },
    };

    export const SPLIT_KNOBS: Knobs<ScanlineHorizontalSplitOpts> = {
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far a row slides at the peak of the sweep. Rows above and below the middle go opposite ways, which is what splits the picture.",
            min: 5,
            max: 25,
            step: 5,
        },
    };

    export const STRETCH_KNOBS: Knobs<ScanlineHorizontalStretchOpts> = {
        peakScalePercent: {
            kind: "number",
            label: "Peak scale (%)",
            hint: "How wide a row is stretched at the peak of the sweep. 100 is its resting width.",
            min: 120,
            max: 200,
            step: 10,
        },
    };

    export const HUE_KNOBS: Knobs<ScanlineHorizontalHueOpts> = {};

    export const BRIGHTNESS_KNOBS: Knobs<ScanlineHorizontalBrightnessOpts> = {};

    export const GRAYSCALE_KNOBS: Knobs<ScanlineHorizontalGrayscaleOpts> = {};

    export const WAVE_KNOBS: Knobs<_ScanlineHorizontalWaveOpts> = {
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far a row swings to each side, as a share of its own width.",
            min: 5,
            max: 25,
            step: 5,
        },
        waveCount: {
            kind: "number",
            label: "Wave count",
            hint: "How many complete waves fit down the picture at once. More waves make a tighter ripple.",
            min: 1,
            max: 8,
            step: 1,
        },
    };

    export const ROLL_KNOBS: Knobs<_ScanlineHorizontalRollOpts> = {
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far the picture rolls vertically over one pass, as a share of a row's height.",
            min: 20,
            max: 200,
            step: 20,
        },
        seamBrightnessPercent: {
            kind: "number",
            label: "Seam brightness (%)",
            hint: "How much the join between the old and the new picture flares as it passes. 0 leaves it invisible.",
            min: 0,
            max: 100,
            step: 10,
        },
    };

    export const DROPOUT_KNOBS: Knobs<_ScanlineHorizontalDropoutOpts> = {
        dropChance: {
            kind: "number",
            label: "Drop chance (0-1)",
            hint: "How likely any one row is to drop out as the sweep reaches it. 1 drops every row.",
            min: 0.1,
            max: 1,
            step: 0.1,
        },
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far a dropping row slides sideways as it fades, as a share of its own width.",
            min: 5,
            max: 25,
            step: 5,
        },
    };

    export const INTERLACE_KNOBS: Knobs<_ScanlineHorizontalInterlaceOpts> = {
        dipPercent: {
            kind: "number",
            label: "Dip (%)",
            hint: "How far the brightness swings as the sweep passes. Alternate rows swing opposite ways, which is what gives the scan-line banding.",
            min: 10,
            max: 90,
            step: 10,
        },
        fieldCount: {
            kind: "number",
            label: "Field count",
            hint: "How many times the banding flickers over one pass. More fields make a faster flicker.",
            min: 2,
            max: 16,
            step: 2,
        },
    };

    export const SKEW_KNOBS: Knobs<_ScanlineHorizontalSkewOpts> = {
        skewDegrees: {
            kind: "number",
            label: "Skew (°)",
            hint: "How far a row leans at the peak of the sweep. It leans one way on the way in and the other on the way out.",
            min: 5,
            max: 45,
            step: 5,
        },
    };
}
