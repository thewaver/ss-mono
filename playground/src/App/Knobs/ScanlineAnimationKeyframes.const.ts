import type {
    ScanlineHorizontalBrightnessOpts,
    ScanlineHorizontalDropoutOpts,
    ScanlineHorizontalGrayscaleOpts,
    ScanlineHorizontalHueOpts,
    ScanlineHorizontalInterlaceOpts,
    ScanlineHorizontalSnakeOpts,
    ScanlineHorizontalSplitOpts,
    ScanlineHorizontalStretchOpts,
} from "@thewaver/ss-components";

import type { Knobs } from "../PageComponents/Knobs/KnobDefs.types";

export namespace ScanlineAnimationKeyframeKnobs {
    export const SNAKE_KNOBS: Knobs<ScanlineHorizontalSnakeOpts> = {
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far a row slides sideways at the peak of the sweep, as a share of its own width.",
            controls: "Sets ScanlineHorizontalSnakeOpts.shiftPercent",
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
            controls: "Sets ScanlineHorizontalSplitOpts.shiftPercent",
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
            controls: "Sets ScanlineHorizontalStretchOpts.peakScalePercent",
            min: 120,
            max: 200,
            step: 10,
        },
    };

    export const HUE_KNOBS: Knobs<ScanlineHorizontalHueOpts> = {};

    export const BRIGHTNESS_KNOBS: Knobs<ScanlineHorizontalBrightnessOpts> = {};

    export const GRAYSCALE_KNOBS: Knobs<ScanlineHorizontalGrayscaleOpts> = {};

    export const DROPOUT_KNOBS: Knobs<ScanlineHorizontalDropoutOpts> = {
        dropChance: {
            kind: "number",
            label: "Drop chance (0-1)",
            hint: "How likely any one row is to drop out as the sweep reaches it. 1 drops every row.",
            controls: "Sets ScanlineHorizontalDropoutOpts.dropChance",
            min: 0.1,
            max: 1,
            step: 0.1,
        },
        shiftPercent: {
            kind: "number",
            label: "Shift (%)",
            hint: "How far a dropping row slides sideways as it fades, as a share of its own width.",
            controls: "Sets ScanlineHorizontalDropoutOpts.shiftPercent",
            min: 5,
            max: 25,
            step: 5,
        },
    };

    export const INTERLACE_KNOBS: Knobs<ScanlineHorizontalInterlaceOpts> = {
        dipPercent: {
            kind: "number",
            label: "Dip (%)",
            hint: "How far the brightness swings as the sweep passes. Alternate rows swing opposite ways, which is what gives the scan-line banding.",
            controls: "Sets ScanlineHorizontalInterlaceOpts.dipPercent",
            min: 10,
            max: 90,
            step: 10,
        },
        fieldCount: {
            kind: "number",
            label: "Field count",
            hint: "How many times the banding flickers over one pass. More fields make a faster flicker.",
            controls: "Sets ScanlineHorizontalInterlaceOpts.fieldCount",
            min: 2,
            max: 16,
            step: 2,
        },
    };
}
